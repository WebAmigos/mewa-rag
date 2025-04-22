import { z } from "zod";

const envSchema = z.object({
  // Target env
  TARGET_ENV: z.enum(["local", "test", "e2e", "ci", "staging", "production"]),

  DATABASE_URL: z.string().url(),
  DATABASE_DIRECT_URL: z.string().url(),

  // Redis for organization settings
  REDIS_URL: z.string().url(),

  // Temporal
  TEMPORAL_SERVER_ADDRESS: z.string(),
  // For Temporal Cloud
  // TEMPORAL_NAMESPACE: z.string(),
  // TEMPORAL_CERT: z.string(),
  // TEMPORAL_KEY: z.string(),

  // Qdrant
  QDRANT_URL: z.string().url(),
  // QDRANT_API_KEY: z.string(), // for staging and production

  // AWS
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_DOCUMENTS_BUCKET: z.string(),

  // Pusher
  PUSHER_APP_ID: z.string(),
  PUSHER_KEY: z.string(),
  PUSHER_SECRET: z.string(),
  NEXT_PUBLIC_PUSHER_KEY: z.string(),
});

export const validateEnvs = () => envSchema.safeParse(process.env);
