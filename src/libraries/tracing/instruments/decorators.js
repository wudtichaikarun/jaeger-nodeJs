import { Span } from 'opentracing'
import * as uuid from 'uuid'
import { traceUtil } from '../../../bootstrapTracer'
const hooks = require('async-hooks')

export function Tracing(Class) {
  return (...args) => {
    const instance = new Class(...args)
    hooks(instance)

    const instanceName = instance.constructor.name
    const methodsNames = Object.getOwnPropertyNames(instance.__proto__).filter(
      (prop) => prop != 'constructor',
    )

    if (methodsNames.length) {
      methodsNames.forEach((methodName) => {
        let span

        instance.will(methodName, () => {
          span = traceUtil.startSpan(`${instanceName}-${methodName}`, {
            currentSpan: traceUtil.getCurrentSpan(),
          })
        })

        instance.did(methodName, (resp) => {
          traceUtil.finishSpan(span)
          return resp
        })
      })
    }

    return instance
  }
}
