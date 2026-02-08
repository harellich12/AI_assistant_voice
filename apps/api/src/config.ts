import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  AUTH_DEV_TOKEN: z.string().default("dev"),
  NODE_ENV: z.string().default("development")
});

export type Config = z.infer<typeof schema>;

export function loadConfig(): Config {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid config: ${parsed.error.message}`);
  }
  return parsed.data;
}
