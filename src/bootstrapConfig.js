import 'dotenv/config'

export const config = {
  SERVER_HOST: process.env.SERVER_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  SERVER_ENABLED: true,
  JAEGER_AGENT_HOST: process.env.JAEGER_AGENT_HOST,
  JAEGER_AGENT_PORT: process.env.JAEGER_AGENT_PORT,
  database: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  },
  amqp: {
    AMQP_URI: process.env.AMQP_URI,
    AMQP_USERNAME: process.env.AMQP_USERNAME,
    AMQP_PASSWORD: process.env.AMQP_PASSWORD,
  },
}
