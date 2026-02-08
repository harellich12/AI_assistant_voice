import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "./db.js";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null
});

export const reminderQueue = new Queue("reminders", { connection });

// Placeholder worker. In Sprint 1, we only enqueue; processing can be added later.
new Worker(
  "reminders",
  async (job) => {
    const { taskId, userId, title, remindAt } = job.data as {
      taskId: string;
      userId: string;
      title: string;
      remindAt: string;
    };
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "task_reminder",
        title,
        payload: {
          taskId,
          remindAt
        }
      }
    });
    const webhookUrl = process.env.REMINDER_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            notificationId: notification.id,
            userId,
            type: "task_reminder",
            title,
            remindAt,
            taskId
          })
        });
        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.error("webhook delivery failed", res.status, await res.text());
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("webhook delivery error", err);
      }
    }
    // eslint-disable-next-line no-console
    console.log("reminder delivered", { taskId, userId, title, remindAt });
  },
  { connection }
);

// Keep process alive
setInterval(() => {}, 1 << 30);
