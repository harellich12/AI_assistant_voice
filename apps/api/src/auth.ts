import type { FastifyRequest, FastifyReply } from "fastify";
import { loadConfig } from "./config.js";

const cfg = loadConfig();

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer ")) {
    reply.code(401).send({ error: "missing_bearer_token" });
    return;
  }
  const token = header.slice("Bearer ".length);
  if (token !== cfg.AUTH_DEV_TOKEN) {
    reply.code(403).send({ error: "invalid_token" });
    return;
  }
  (req as any).user = { id: "dev-user" };
}
