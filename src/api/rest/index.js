// @flow
import path from 'path'
import koaCors from '@koa/cors'
import koa from 'koa'
import koaBodyParser from 'koa-bodyparser'
import koaCompress from 'koa-compress'
import { load } from '@spksoft/koa-decorator'
import { logger, ILogger } from '../../libraries/logger/logger'
import { pathNotFoundHandler } from '../../middlewares/pathNotFoundHandler'
import { loggingMiddleware } from '../../middlewares/logging'

export interface IRestApiServer {
  port?: number;
  hostname?: string;
  autoStart?: boolean;
  appName?: string;
  appDescription?: string;
  appVersion?: string;
}

export class RestApiServer {
  app: koa
  port: number
  hostname: string
  options: IRestApiServer
  logger: ILogger

  constructor(options: IRestApiServer) {
    this.hostname = options.hostname || '0.0.0.0'
    this.port = options.port || 8080
    this.options = options
    this.logger = logger

    this.app = new koa()

    this.app.use(koaCors())
    this.app.use(koaBodyParser())
    this.app.use(koaCompress())
    this.app.use(loggingMiddleware({ logger: this.logger }))

    // business logic endpoints
    const apiRouter = load(path.resolve(__dirname, 'controllers'), '.controller.js')
    this.app.use(apiRouter.routes())

    this.app.use(pathNotFoundHandler)
  }

  start = () => {
    const server = this.app.listen(this.port, this.hostname, () =>
      console.log(
        { event: 'server_started' },
        `Server listen at http://${this.hostname}:${this.port}`,
      ),
    )
  }
}
