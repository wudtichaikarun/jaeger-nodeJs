import { config } from './bootstrapConfig'
import { logger } from './libraries/logger/logger'

export const defaultLogger = new JsonLogger(config.APP_NAME, {
  level: config.LOG_LEVEL,
  appVersion: config.APP_VERSION,
})
