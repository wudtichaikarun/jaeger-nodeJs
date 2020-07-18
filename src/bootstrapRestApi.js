import { RestApiServer } from './api/rest'
import { globalTracingMiddleware } from './middlewares/tracing'
import { config } from './bootstrapConfig'
import { traceUtil } from './bootstrapTracer'
import { ensureConfigKeys } from './utils/configUtil'

export const enableTracing = globalTracingMiddleware(traceUtil)

try {
  if (config.SERVER_ENABLED) {
    ensureConfigKeys(config, 'SERVER_HOST', 'SERVER_PORT')

    const restApiServer = new RestApiServer({
      port: config.SERVER_PORT,
      hostname: config.SERVER_HOST,
      appName: config.APP_NAME,
      appDescription: config.APP_DESCRIPTION,
      appVersion: config.APP_VERSION,
    })

    restApiServer.start()
  }
} catch (error) {
  process.exit(-1)
}
