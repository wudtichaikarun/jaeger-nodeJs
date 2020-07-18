// @flow
import R from 'ramda'
import rascal from 'rascal'
import { logger } from '../logger/logger'

const exchanges = ['traced_queue']

const subscribeConfig = {
  queueList: [
    {
      queue: 'traced_queue',
      options: {},
    },
  ],
}

const publishConfig = {
  queueList: [],
}

function setupQueue() {
  const subscribeQueues = R.path(['queueList'], subscribeConfig)
  const publishQueues = R.path(['queueList'], publishConfig)
  const queueLists = [...subscribeQueues, ...publishQueues]

  const queues = R.isEmpty(queueLists)
    ? {}
    : queueLists.reduce(
        (acc, { queue, options }) => ({
          ...acc,
          [`${queue}`]: { options: { ...options } },
        }),
        {},
      )

  const subscriptions = R.isEmpty(subscribeQueues)
    ? {}
    : subscribeQueues.reduce(
        (acc, { queue }) => ({
          ...acc,
          [queue]: {
            queue: [`${queue}`],
          },
        }),
        {},
      )
  logger.info({ event: 'setup subscriptions' })

  const publications = R.isEmpty(publishQueues)
    ? {}
    : publishQueues.reduce(
        (acc, { queue }) => ({
          ...acc,
          [`${queue}`]: {
            exchange: R.path(['1'], exchanges),
            routingKey: queue,
          },
        }),
        {},
      )
  logger.info({ event: 'setup publications' })

  return {
    queues,
    subscriptions,
    publications,
  }
}

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
        exchanges: [...exchanges],
        ...setupQueue(),
      },
    },
  }
}

let _broker

export function createAmqpConnection(options: IAmqpConnectionOptions) {
  const rascalConfig = buildConfig(options)
  logger.info(rascalConfig)
  rascal.Broker.create(rascal.withDefaultConfig(rascalConfig), (error, broker) => {
    if (error) {
      logger.error(error, { event: 'createAmqpConnection' })
      throw error
    }
    logger.info({ event: 'createAmqpConnection' })

    _broker = broker

    broker.subscribe('traced_queue', (error, subscription) => {
      if (error) {
        logger.error(error, { event: 'traced_queue' })
      }

      subscription.on('message', (message, content, ackOrNack) => {
        console.log('subscription_traced_queue', content.toString())
        ackOrNack()
      })
    })
  })
}

export const Broker = _broker
