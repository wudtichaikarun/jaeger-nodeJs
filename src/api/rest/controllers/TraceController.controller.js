import { HttpMethod, route } from '@spksoft/koa-decorator'
import { enableTracing } from '../../../bootstrapRestApi'
import tracerDomain from '../../../domains/tracer/tracer'

@route('/trace')
export class TraceController {
  @route('/', HttpMethod.GET)
  async tracing(ctx) {
    const response = await tracerDomain.process()
    return response
  }
}
