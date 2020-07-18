// @flow
import R from 'ramda'
import rascal from 'rascal'
var shimmer = require('shimmer')
import { logger } from '../logger/logger'
import { traceUtil } from '../../bootstrapTracer'

export interface IAmqpConnectionOptions {
  connectionUrl: string;
  username: string;
  password: string;
  prefix?: string;
  defaultSubscription?: any;
}

function mappingAmqpConfigConnection(config: IAmqpConnectionOptions) {
  const { connectionUrl, username, password } = config
  return connectionUrl.split(',').map((uri: string) => ({
    url: uri.replace(`://`, `://${username}:${password}@`),
  }))
}

function buildConfig(config: IAmqpConnectionOptions) {
  return {
    vhosts: {
      config: {
        connections: mappingAmqpConfigConnection(config),
        exchanges: ['demo_ex'],
        queues: ['demo_q'],
        bindings: ['demo_ex[a.b.c] -> demo_q'],
        publications: {
          demo_pub: {
            exchange: 'demo_ex',
            routingKey: 'a.b.c',
          },
        },
        subscriptions: {
          demo_sub: {
            queue: 'demo_q',
            prefetch: 3,
          },
        },
      },
    },
  }
}

let Broker = null

export async function createAmqpConnection(options: IAmqpConnectionOptions) {
  const rascalConfig = buildConfig(options)
  logger.info(rascalConfig)

  const broker = await rascal.BrokerAsPromised.create(rascalConfig)
  broker.on('error', console.error)

  Broker = broker
  let config = {
    options: {
      headers: {},
    },
  }

  shimmer.wrap(broker, 'publish', function (original) {
    return function () {
      traceUtil.injectTracingContext(config.options.headers)
      const returned = original.apply(this, [...arguments, config])
      return returned
    }
  })

  const publication = await broker.publish('demo_pub', 'Hello World!')
  publication.on('error', console.error)

  const subscription = await broker.subscribe('demo_sub')
  subscription.on('message', (message, content, ackOrNack) => {
    console.dir(message, { depth: 5 })
    ackOrNack()
  })
}

export { Broker }
