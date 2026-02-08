import fastify from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { authMiddleware } from "./auth.js";
import { prisma } from "./db.js";
import { reminderQueue } from "./queue.js";

const cfg = loadConfig();
const app = fastify({
  logger: true,
  requestIdHeader: "x-request-id",
  genReqId: (req) => {
    const incoming = req.headers["x-request-id"];
    if (typeof incoming === "string" && incoming.length > 0) return incoming;
    return randomUUID();
  }
});

const InterpretRequestSchema = z.object({
  utterance: z.string().min(1),
  input_mode: z.enum(["voice", "text"]).default("voice")
});

const ConfirmRequestSchema = z.object({
  proposal_id: z.string().min(1),
  decision: z.enum(["confirm", "cancel"])
});

const TaskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  due_at: z.string().optional(),
  reminder_at: z.string().optional(),
  tags: z.array(z.string()).default([])
});

const proposals = new Map<
  string,
  { intent: "task.create"; entities: Record<string, unknown> }
>();

function parseOptionalDate(value?: string) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

async function writeAudit(params: {
  userId: string;
  actionType: "task_create";
  status: "success" | "failed" | "canceled";
  targetId?: string;
  requestId: string;
}) {
  await prisma.actionAudit.create({
    data: {
      userId: params.userId,
      actor: "assistant",
      actionType: params.actionType,
      status: params.status,
      targetId: params.targetId,
      requestId: params.requestId
    }
  });
}

async function enqueueReminder(params: {
  taskId: string;
  userId: string;
  title: string;
  remindAt?: Date;
}) {
  if (!params.remindAt) return;
  const delayMs = Math.max(0, params.remindAt.getTime() - Date.now());
  await reminderQueue.add(
    "task_reminder",
    {
      taskId: params.taskId,
      userId: params.userId,
      title: params.title,
      remindAt: params.remindAt.toISOString()
    },
    { delay: delayMs }
  );
}

app.get("/health", async (_req, reply) => {
  reply.send({ ok: true });
});

app.register(async (protectedRoutes) => {
  protectedRoutes.addHook("onRequest", authMiddleware);

  protectedRoutes.post("/v1/assistant/interpret", async (req, reply) => {
    const parsed = InterpretRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400).send({ error: parsed.error.flatten() });
      return;
    }

    const proposalId = randomUUID();
    const entities = {
      title: parsed.data.utterance
    };
    proposals.set(proposalId, { intent: "task.create", entities });

    reply.send({
      proposal_id: proposalId,
      intent: "task.create",
      entities,
      requires_confirmation: true
    });
  });

  protectedRoutes.post("/v1/assistant/confirm", async (req, reply) => {
    const parsed = ConfirmRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400).send({ error: parsed.error.flatten() });
      return;
    }

    const proposal = proposals.get(parsed.data.proposal_id);
    if (!proposal) {
      await writeAudit({
        userId: "dev-user",
        actionType: "task_create",
        status: "failed",
        requestId: req.id
      });
      reply.code(404).send({ error: "proposal_not_found" });
      return;
    }

    if (parsed.data.decision === "cancel") {
      await writeAudit({
        userId: "dev-user",
        actionType: "task_create",
        status: "canceled",
        requestId: req.id
      });
      reply.send({ status: "canceled" });
      return;
    }

    // Confirmed: create task using entities from proposal
    const title = String(proposal.entities.title ?? "").trim();
    if (!title) {
      await writeAudit({
        userId: "dev-user",
        actionType: "task_create",
        status: "failed",
        requestId: req.id
      });
      reply.code(400).send({ error: "missing_title" });
      return;
    }

    const task = await prisma.task.create({
      data: {
        userId: "dev-user",
        title,
        description: undefined,
        priority: "medium",
        dueAt: undefined,
        reminderAt: undefined,
        tags: []
      }
    });
    await enqueueReminder({
      taskId: task.id,
      userId: "dev-user",
      title: task.title,
      remindAt: task.reminderAt ?? undefined
    });
    await writeAudit({
      userId: "dev-user",
      actionType: "task_create",
      status: "success",
      targetId: task.id,
      requestId: req.id
    });

    reply.send({ status: "success", task });
  });

  protectedRoutes.post("/v1/tasks", async (req, reply) => {
    const parsed = TaskCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400).send({ error: parsed.error.flatten() });
      return;
    }

    const idemKey = req.headers["idempotency-key"];
    if (typeof idemKey === "string" && idemKey.length > 0) {
      const existing = await prisma.task.findFirst({
        where: { idempotencyKey: idemKey, userId: "dev-user" }
      });
      if (existing) {
        reply.send({ status: "ok", task: existing });
        return;
      }
    }

    const dueAt = parseOptionalDate(parsed.data.due_at);
    const reminderAt = parseOptionalDate(parsed.data.reminder_at);
    const task = await prisma.task.create({
      data: {
        userId: "dev-user",
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        dueAt,
        reminderAt,
        tags: parsed.data.tags,
        idempotencyKey: typeof idemKey === "string" ? idemKey : undefined
      }
    });
    await enqueueReminder({
      taskId: task.id,
      userId: "dev-user",
      title: task.title,
      remindAt: task.reminderAt ?? undefined
    });
    await writeAudit({
      userId: "dev-user",
      actionType: "task_create",
      status: "success",
      targetId: task.id,
      requestId: req.id
    });
    reply.send({ status: "created", task });
  });

  protectedRoutes.get("/v1/tasks", async (req, reply) => {
    const tasks = await prisma.task.findMany({
      where: { userId: "dev-user" },
      orderBy: { createdAt: "desc" }
    });
    reply.send({ tasks });
  });

  protectedRoutes.get("/v1/history/actions", async (req, reply) => {
    const actions = await prisma.actionAudit.findMany({
      where: { userId: "dev-user" },
      orderBy: { createdAt: "desc" }
    });
    reply.send({ actions });
  });

  protectedRoutes.get("/v1/notifications", async (req, reply) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: "dev-user" },
      orderBy: { createdAt: "desc" }
    });
    reply.send({ notifications });
  });
});

app.listen({ port: cfg.PORT, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
