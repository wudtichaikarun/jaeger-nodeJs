import { HttpMethod, route } from '@spksoft/koa-decorator'
import { enableTracing } from '../../../bootstrapRestApi'
import tracerDomain from '../../../domains/tracer/tracer'
import { Tracing } from '../../../libraries/tracing/instruments/decorators'
import { Broker } from '../../../libraries/amqp/index'

@route('/trace')
export class TraceController {
  @route('/', HttpMethod.GET, enableTracing)
  async tracing(ctx) {
    const response = await tracerDomain.process()
    return response
  }

  @route('/amqp', HttpMethod.GET)
  async tracingAmqp(ctx) {
    let publish = false

    if (Broker) {
      publish = true
      const publication = await Broker.publish('demo_pub', 'Hello World!')
      publication.on('error', console.error)
    }

    return { publish }
  }
}
