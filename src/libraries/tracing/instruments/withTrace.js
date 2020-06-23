// @flow
const hooks = require('async-hooks')
import { traceUtil } from '../../../bootstrapTracer'

/**
 * @param  Target A class instance
 * @param  methodsName method name inside class or function
 */
export function withTrace(Target: any, methodsName: string[]) {
  hooks(Target)

  if (methodsName.length) {
    methodsName.forEach((methodName) => {
      let span
      Target.will(`${methodName}`, () => {
        span = traceUtil.startSpan(`${methodName}`, { currentSpan: traceUtil.getCurrentSpan() })
      })

      Target.did(`${methodName}`, (res) => {
        span && span.finish()
        return res
      })
    })
  }

  return Target
}
