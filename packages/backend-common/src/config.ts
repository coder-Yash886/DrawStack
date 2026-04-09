import { z } from "zod";

export const JwtConfig = z.object({
  JWT_SECRET: z.string().min(1)
});

export function validateEnv(env: unknown) {
  return JwtConfig.parse(env);
}

export const JWT_SECRET = process.env.JWT_SECRET || "123123"