import { Span } from 'opentracing'
import { traceUtil } from '../../../bootstrapTracer'
const Module = require('module')
const hooks = require('async-hooks')

console.log(Object.getOwnPropertyNames(Module))

const load = Module._load
Module._load = function (request, parent) {
  const mod = load.apply(this, arguments)
  const isLocalRequest = request === '../../../domains/tracer/tracer'

  if (isLocalRequest) {
    hooks(mod.default)
    console.log(mod)

    const methodsNames = Object.getOwnPropertyNames(mod.default.__proto__).filter(
      (prop) => prop != 'constructor',
    )

    console.log('methodsNames', methodsNames)

    methodsNames.forEach((methodName) => {
      let span

      mod.default.will(methodName, () => {
        span = traceUtil.startSpan(`${methodName}`, { currentSpan: traceUtil.getCurrentSpan() })
      })

      mod.default.did(methodName, (resp) => {
        span && span.finish()
        return resp
      })
    })
  }

  return mod
}
