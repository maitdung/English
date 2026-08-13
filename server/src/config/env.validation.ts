import { z } from 'zod';

import { isCloudflarePagesDeployHookUrl } from './cloudflare-pages-deploy-hook';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  API_PREFIX: z.string().min(1).default('api'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_HOST: z.string().min(1).default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  HEALTH_CHECK_REDIS_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  PASSWORD_RESET_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  PASSWORD_RESET_EXPOSE_TOKEN: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  ENABLE_VOCABULARY_ENRICHMENT: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  CLOUDFLARE_PAGES_DEPLOY_HOOK_URL: z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim() === '' ? undefined : value,
    z
      .string()
      .trim()
      .url()
      .refine(isCloudflarePagesDeployHookUrl, {
        message:
          'CLOUDFLARE_PAGES_DEPLOY_HOOK_URL must be a Cloudflare Pages HTTPS deploy hook',
      })
      .optional(),
  ),
  FRONTEND_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().optional().default(''),
  XAI_API_KEY: z.string().optional().default(''),
  GROK_API_KEY: z.string().optional().default(''),
  GEMINI_API_KEY: z.string().optional().default(''),
  AI_PROVIDER: z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.enum(['openai', 'xai', 'gemini']).optional(),
  ),
  OPENAI_WRITING_MODEL: z.string().min(1).default('gpt-4o-mini'),
  XAI_WRITING_MODEL: z.string().min(1).default('grok-4.3'),
  GEMINI_WRITING_MODEL: z.string().min(1).default('gemini-3.5-flash'),
  XAI_SPEAKING_MODEL: z.string().min(1).default('grok-4.3'),
  GEMINI_SPEAKING_MODEL: z.string().min(1).default('gemini-3.5-flash'),
  AI_REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(3_000)
    .max(60_000)
    .default(15_000),
  WRITING_AI_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(60_000)
    .default(20_000),
  WRITING_RETENTION_DAYS: z.coerce
    .number()
    .int()
    .min(7)
    .max(3_650)
    .default(365),
  ENABLE_SWAGGER_DOCS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.message}`,
    );
  }

  return parsed.data;
}
