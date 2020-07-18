import { HttpMethod, route } from '@spksoft/koa-decorator'
import { enableTracing } from '../../../bootstrapRestApi'
import tracerDomain from '../../../domains/tracer/tracer'
import { Tracing } from '../../../libraries/tracing/instruments/decorators'

@route('/trace')
export class TraceController {
  @route('/', HttpMethod.GET, enableTracing)
  async tracing(ctx) {
    const response = await tracerDomain.process()
    return response
  }
}
