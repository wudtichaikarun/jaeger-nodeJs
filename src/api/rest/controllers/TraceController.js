import { Controller, Get, UseBefore } from 'routing-controllers'
import { Context } from 'koa'
import { enableTracing } from '../../../bootstrapRestApi'
import { request } from './index'

@Controller('/trace')
@UseBefore(enableTracing)
export class TraceController {
  @Get()
  async trace(ctx: Context) {
    const response = await request.process()
    return response
  }
}
