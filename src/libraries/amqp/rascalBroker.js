import { BrokerAsPromised as Broker } from 'rascal'

export class RascalBroker {
  broker
  status
  brokerConfig
  logger
  tracer

  constructor(brokerConfig, logger, tracer) {
    this.brokerConfig = brokerConfig
    this.logger = logger
    this.tracer = tracer
  }

  setStatus(status, statusMessage) {
    this.status = { status, statusMessage }
  }

  async connect() {
    this.broker = await Broker.create(this.brokerConfig)
    this.setStatus('connected')

    this.broker.on('error', (err: any) => {
      this.setStatus('error', err)
      this.logger.error(err)
      this.logger.error(err, {
        event: 'rascal_error',
        error_type: 'broker_config',
      })
    })

    this.broker.on('vhost_initialised', ({ vhost, connectionUrl }) => {
      this.setStatus('connected', 'vhost_initialised')
      this.logger.warn(`Vhost: ${vhost} was initialised using connection: ${connectionUrl}`)
    })

    this.broker.on('blocked', (reason, { vhost, connectionUrl }) => {
      this.setStatus('blocked', reason)
      this.logger.warn(
        `Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`,
      )
    })

    this.broker.on('unblocked', ({ vhost, connectionUrl }) => {
      this.setStatus('connected', 'unblocked')
      this.logger.warn(`Vhost: ${vhost} was unblocked using connection: ${connectionUrl}.`)
    })

    return this.broker
  }

  injectTracingContext(config) {
    if (this.tracer) {
      config.options = config.options || {}
      config.options.headers = config.options.headers || {}
      this.tracer.injectTracingContext(config.options.headers)
    }
  }

  //   startSpan() {}

  //   finishSpan() {}

  async publish(config, message) {
    let content = message

    if ('message' in message) {
      content = message.message
      config = Object.assign({}, config, message.config)
    }

    this.injectTracingContext(config)

    const name = config.exchange || config.queue || '/'

    const publication = await this.broker.publish(name, content, config)
    publication.on('error', (err: any) => {
      this.setStatus('error', err)
      this.logger.error(err, {
        event: 'rascal_error',
        error_type: 'publish_config',
        exchange: config.exchange,
        queue: config.queue,
      })
    })
  }

  async subscribe(queueConfig) {
    const subscription = await this.broker.subscribe(queueConfig.queueName)
    subscription.on('message', async (message: Message, content: any, ackOrNack: any) => {
      console.log('queueConfig____', queueConfig, message)
    })
  }

  //   shutdown() {}
}
