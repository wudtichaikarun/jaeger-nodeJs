import { config } from './bootstrapConfig'
import { logger } from './libraries/logger/logger'
import { MongoConnection } from './libraries/mongo/mongoConnection'
// import { instrumentMongoose } from './libraries/tracing/instruments/mongoose';
import { ensureConfigKeys } from './utils/configUtil'

try {
  ensureConfigKeys(config.database, 'MONGO_URI')

  const mongooseOptions = {
    dbName: config.database.MONGO_DATABASE_NAME,
    user: config.database.MONGO_USERNAME,
    pass: config.database.MONGO_PASSWORD,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }

  const mongoose = new MongoConnection(
    {
      uri: config.database.MONGO_URI,
      options: mongooseOptions,
    },
    logger,
  )

  // instrument mongoose
  //   instrumentMongoose();

  // load all repositories
  require('./adapters/mongo/repositories') // register all mongo repositories

  mongoose.connect()
} catch (error) {
  logger.error(error, { event: 'bootstrap_mongo' })

  process.exit(-1)
}
