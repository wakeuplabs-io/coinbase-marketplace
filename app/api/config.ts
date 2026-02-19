import "server-only";
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
    const fieldErrors = result.error.flatten().fieldErrors;
    const missingVars = (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).filter(
      key => fieldErrors[key] !== undefined
    );
    
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(fieldErrors, null, 2));
    
    // Build a helpful error message
    const missingList = missingVars.map(varName => `  - ${varName}`).join("\n");
    const errorMessage = `Invalid environment variables. Missing or invalid variables:\n${missingList}\n\nTo fix this in AWS Amplify:\n1. Go to AWS Amplify Console → Your App → App settings → Environment variables\n2. Add the missing variables listed above\n3. Redeploy your application\n\nFor more details, see the README.md file.`;
    
    throw new Error(errorMessage);
  }
  return result.data;
}
