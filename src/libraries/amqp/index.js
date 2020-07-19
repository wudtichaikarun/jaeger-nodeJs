// @flow
import R from 'ramda'
import { logger } from '../logger/logger'
import { traceUtil } from '../../bootstrapTracer'
import { RascalBroker } from './rascalBroker'

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

  const broker = new RascalBroker(rascalConfig, logger, traceUtil)
  await broker.connect()

  Broker = broker
  await Promise.all([broker.subscribe({ queueName: 'demo_sub' })])
}

export { Broker }
