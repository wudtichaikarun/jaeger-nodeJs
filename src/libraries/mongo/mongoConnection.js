import { connect, ConnectionOptions } from 'mongoose'
import { logger, ILogger } from '../logger/logger'

export interface IMongoConnection {
  uri: string;
  options: ConnectionOptions;
}

export class MongoConnection {
  uri: string
  options: ConnectionOptions
  connected: boolean = false
  logger: ILogger

  constructor({ uri, options }: IMongoConnection, logger?: ILogger = logger) {
    this.uri = uri
    this.logger = logger
    this.options = options
  }

  connect = async () => {
    if (this.connected) return

    await connect(this.uri, this.options)
    this.logger.info(
      { event: 'mongo_connected', uri: this.uri, dbName: this.options.dbName },
      `Successfully to connected MongoDB`,
    )
    this.connected = true
  }
}
