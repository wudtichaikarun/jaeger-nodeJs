// @flow
import { ensureConfigKeys } from './utils/configUtil'
import { config } from './bootstrapConfig'
import { logger } from './libraries/logger/logger'
import { createAmqpConnection } from './libraries/amqp/index'

async function bootstrapAmqp() {
  try {
    ensureConfigKeys(config.amqp, 'AMQP_URI', 'AMQP_USERNAME', 'AMQP_PASSWORD')
    const options = {
      connectionUrl: config.amqp.AMQP_URI,
      username: config.amqp.AMQP_USERNAME,
      password: config.amqp.AMQP_PASSWORD,
    }

    createAmqpConnection(options)

    logger.info({ event: 'bootstrapAmqp' })
  } catch (error) {
    logger.error(error, { event: 'bootstrapAmqp' })
    process.exit(-1)
  }
}

bootstrapAmqp()
