import { HttpMethod, route, load } from '@spksoft/koa-decorator'
import { enableTracing } from '../../../bootstrapRestApi'
import { requestWithTrace } from './index'

@route('/trace')
export class TraceController {
  @route('/', HttpMethod.GET, enableTracing)
  async trace(ctx) {
    const response = await requestWithTrace.process()
    return response
  }
}
