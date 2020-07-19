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

  @route('/amqp', HttpMethod.GET, enableTracing)
  async tracingAmqp(ctx) {
    if (Broker) {
      const publication = await Broker.publish({ queue: 'demo_pub' }, { message: 'Hello World!' })
    }

    const response = await tracerDomain.process()
    return response
  }
}
