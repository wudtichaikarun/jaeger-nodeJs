import { HttpMethod, route } from '@spksoft/koa-decorator'

@route('/v1/demos')
export class DemoController {
  @route('/', HttpMethod.POST)
  async createDemo(ctx) {
    const { body } = ctx.request
    console.log(body)
    ctx.body = body
  }
}
