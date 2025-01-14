import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  server: {},
  client: {},
  runtimeEnv: {},
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== "false" &&
    process.env.SKIP_ENV_VALIDATION !== "0",
})
