// @flow
import 'dotenv/config'
import tracer from 'jaeger-client'
import { ITracingInfo } from './librariers/tracing/interface'
import { TraceUtil } from './librariers/tracing/traceUtil'
import { config } from './bootstrapConfig'
import { ensureConfigKeys } from './utils/configUtil'

const hpropagate = require('hpropagate')
const hpropagateTracer = require('hpropagate/lib/tracer')

const DEFAULT_TRACING_KEY = 'uber-trace-id'

const headersToPropagate = [
  'x-request-id',
  'x-b3-traceid',
  'x-b3-spanid',
  'x-b3-parentspanid',
  'x-b3-sampled',
  'x-b3-flags',
  'x-ot-span-context',
  'x-variant-id',
  'x-correlation-id',
  DEFAULT_TRACING_KEY,
]

hpropagate({
  headersToPropagate,
  //   setAndPropagateCorrelationId: true, // disable auto generate key
})

const tracingConfig: tracer.TracingConfig = {
  serviceName: 'tracing-test',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
  },
}

var DEFAULT_OPTIONS = {
  logger: {
    info: function info(msg) {
      console.log('INFO : ', msg)
    },
    error: function error(msg) {
      console.log('ERROR : ', msg)
    },
  },
}

const globalTracer = tracer.initTracerFromEnv(tracingConfig, DEFAULT_OPTIONS)

const tracingInfo: ITracingInfo = {
  headersToPropagate,
  globalTracer,
  globalTracingKey: DEFAULT_TRACING_KEY,
  localTracer: hpropagateTracer,
  localTracingKey: 'x-correlation-id',
}

ensureConfigKeys(config, 'JAEGER_AGENT_HOST', 'JAEGER_AGENT_PORT')

export const traceUtil = new TraceUtil(tracingInfo)
