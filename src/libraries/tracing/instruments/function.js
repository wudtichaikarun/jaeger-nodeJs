// import { Span } from 'opentracing'
import { traceUtil } from '../../../bootstrapTracer'
const Formatter = require('njstrace/lib/formatter.js')
// const hooks = require('async-hooks')

// class MyFormatter {
//   // span: Span

//   constructor() {
//     hooks(this)
//   }

//   /**
//    This method is called whenever a traced function is being called, the method gets a single args object with the following
//     - name {string} - The traced function name
//     - file {string} - The traced file
//     - line {number} - The traced function line number
//     - args {object} - The function arguments object
//     - stack {Tracer.CallStack} - The current call stack including the current traced function (see Tracer.CallStack below)
//   */
//   onEntry(args) {
//     const isModuleFromDomain = args.file.split('/').includes('domains')
//     const [methodName] = args.name.match(/_callee|Anonymous|step/g) || ''

//     if (isModuleFromDomain && !methodName) {
//       console.log('onEntry..')

//       // willHooks(args.name)
//       didHooks(args.name)
//     }
//   }

//   // getSpan() {
//   //   return this.span
//   // }

//   /**
//     This method is called whenever a traced function returns, the method gets a single args object with the following:
//     - name {string} - The traced function name
//     - file {string} - The traced file
//     - line {number} - The traced function line number
//     - retLine {number} - The line number where the exit is (can be either a return statement of function end)
//     - stack {Tracer.CallStack} - The current call stack AFTER popping the current traced function (see Tracer.CallStack below)
//     - span {number} - The execution time span (milliseconds) of the traced function
//     - exception {boolean} - Whether this exit is due to exception
//     - returnValue {*|null} - The function return value
//    */
//   onExit(args) {
//     const isModuleFromDomain = args.file.split('/').includes('domains')
//     const [methodName] = args.name.match(/_callee|Anonymous|step/g) || ''

//     if (isModuleFromDomain && !methodName) {
//       console.log('onExit..')

//       // didHooks(args.name)
//     }
//   }
// }

// Create my custom Formatter class
function MyFormatter() {
  // No need to call Formatter ctor here
}

let span

// Implement the onEntry method
MyFormatter.prototype.onEntry = function (args) {
  const isModuleFromDomain = args.file.split('/').includes('domains')
  const [methodName] = args.name.match(/_callee|Anonymous|step/g) || ''

  if (isModuleFromDomain && !methodName) {
    span = traceUtil.startSpan(`${args.name}`, { currentSpan: traceUtil.getCurrentSpan() })
  }
}

// Implement the onEntry method
MyFormatter.prototype.onExit = function (args) {
  const isModuleFromDomain = args.file.split('/').includes('domains')
  const [methodName] = args.name.match(/_callee|Anonymous|step/g) || ''

  if (isModuleFromDomain && !methodName) {
    span && span.finish()
  }
}

require('util').inherits(MyFormatter, Formatter)

class FunctionInstruments {
  njstrace: any
  formatter: any

  constructor() {
    this.formatter = new MyFormatter()
    // hooks(this.formatter)
  }

  initNjstrace() {
    this.njstrace = require('njstrace').inject({
      formatter: this.formatter,
      files: ['**/*.js', '!**/node_modules/**'],
    })
  }
}

const functionInstruments = new FunctionInstruments()

export default functionInstruments.initNjstrace()

require('../../../domains/tracer/index')
