import { Span } from 'opentracing'
import { traceUtil } from '../../../bootstrapTracer'
const Module = require('module')
const hooks = require('async-hooks')

const load = Module._load
Module._load = function (request, parent) {
  const mod = load.apply(this, arguments) // load the module with the original method
  // const isNodeModules = parent.path.split('/').includes('node_modules')
  // const isDomainModules = parent.path.split('/').includes('domains')
  const isLocalRequest = request === '../../../domains/tracer/tracer'

  if (isLocalRequest) {
    hooks(mod.default)
    console.log(mod)

    const methodsNames = Object.getOwnPropertyNames(mod.default.__proto__).filter(
      (prop) => prop != 'constructor',
    )

    methodsNames.forEach((methodName) => {
      mod.default.will(methodName, () => {
        console.log('will...', methodName)
      })

      mod.default.did(methodName, (resp) => {
        console.log('did...', methodName)

        return resp
      })
    })

    // https://blog.sqreen.com/building-a-dynamic-instrumentation-agent-for-node-js/
    // console.log('instanceOnly', instanceOnly)
    // console.log('------------------')
  }

  return mod
}

require('../../../domains/tracer/tracer')
