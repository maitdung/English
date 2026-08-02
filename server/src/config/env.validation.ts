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
