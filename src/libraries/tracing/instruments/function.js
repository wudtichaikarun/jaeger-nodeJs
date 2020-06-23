import { Span } from 'opentracing'
import { traceUtil } from '../../../bootstrapTracer'
const Formatter = require('njstrace/lib/formatter.js')

class MyFormatter {
  span: Span

  /**
   This method is called whenever a traced function is being called, the method gets a single args object with the following
    - name {string} - The traced function name
    - file {string} - The traced file
    - line {number} - The traced function line number
    - args {object} - The function arguments object
    - stack {Tracer.CallStack} - The current call stack including the current traced function (see Tracer.CallStack below)
  */
  onEntry(args) {
    const isModuleFromDomain = args.file.split('/').includes('domains')
    const [methodName] = args.name.match(/_callee|Anonymous|step/g) || ''

    if (isModuleFromDomain && !methodName) {
      this.span = traceUtil.startSpan(`${args.name}`, { currentSpan: traceUtil.getCurrentSpan() })
      console.log(`Got call from : ${args.name}`)
    }
  }

  /**
    This method is called whenever a traced function returns, the method gets a single args object with the following:
    - name {string} - The traced function name
    - file {string} - The traced file
    - line {number} - The traced function line number
    - retLine {number} - The line number where the exit is (can be either a return statement of function end)
    - stack {Tracer.CallStack} - The current call stack AFTER popping the current traced function (see Tracer.CallStack below)
    - span {number} - The execution time span (milliseconds) of the traced function
    - exception {boolean} - Whether this exit is due to exception
    - returnValue {*|null} - The function return value
   */
  onExit(args) {
    const isModuleFromDomain = args.file.split('/').includes('domains')
    const [methodName] = args.name.match(/_callee|Anonymous|step/g) || ''

    if (isModuleFromDomain && !methodName) {
      console.log(`Exit from : ${args.name}`)
      this.span.finish()
    }
  }
}

// But must "inherit" from Formatter
require('util').inherits(MyFormatter, Formatter)

export default require('njstrace').inject({
  formatter: new MyFormatter(),
  files: ['**/*.js', '!**/node_modules/**'],
})

require('../../../domains/tracer/index')
