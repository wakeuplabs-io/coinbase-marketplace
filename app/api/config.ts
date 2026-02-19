/**
 * Environment configuration with validation
 * Uses Zod for runtime type safety
 */
import { isAddress } from "viem";
import { z } from "zod";

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Coinbase
  COINBASE_API_KEY_ID: z.string().min(1),
  COINBASE_API_KEY_SECRET: z.string().min(1),
  COINBASE_PAYMENTS_RECEIVER: z.string().refine(isAddress, { message: 'receiver must be a valid Ethereum address' }),
  COINBASE_PAYMENTS_BASE_REDIRECT_URL: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  if (typeof window !== "undefined") {
    throw new Error("getEnv() must not be called on the client");
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    throw new Error("Invalid environment variables. Check Amplify env vars.");
  }
  return result.data;
}
