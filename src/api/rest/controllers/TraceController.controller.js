import { HttpMethod, route, load } from '@spksoft/koa-decorator'
import { enableTracing } from '../../../bootstrapRestApi'
import { request } from './index'

@route('/trace')
export class TraceController {
  @route('/', HttpMethod.GET, enableTracing)
  async trace(ctx) {
    const response = await request.process()
    return response
  }
}
