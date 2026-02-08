import { z } from "zod";

export const InterpretResponseSchema = z.object({
  intent: z.string(),
  entities: z.record(z.any()),
  requires_confirmation: z.boolean()
});

export type InterpretResponse = z.infer<typeof InterpretResponseSchema>;
