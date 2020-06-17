import 'dotenv/config'

export const config = {
  SERVER_HOST: process.env.SERVER_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  SERVER_ENABLED: true,
  JAEGER_AGENT_HOST: process.env.JAEGER_AGENT_HOST,
  JAEGER_AGENT_PORT: process.env.JAEGER_AGENT_PORT,
}
