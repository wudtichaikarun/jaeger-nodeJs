// @flow
import * as uuid from 'uuid'
import { Context } from 'koa'
import { FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP, Span, SpanContext, Tags, Tracer } from 'opentracing'
import { ILocalTracer, ITracingInfo, type ITags, ISpanOptions } from './interface'

export class TraceUtil {
  localTracer: ILocalTracer
  localTracingKey: string
  globalTracer: Tracer
  globalTracingKey: string
  CURRENT_SPAN_KEY: string
  headersToPropagate: string[]

  constructor(tracingInfo: ITracingInfo) {
    this.CURRENT_SPAN_KEY = 'currentSpan'
    this.localTracer = tracingInfo.localTracer
    this.localTracingKey = tracingInfo.localTracingKey || 'x-correlation-id'
    this.globalTracer = tracingInfo.globalTracer
    this.globalTracingKey = tracingInfo.globalTracingKey || 'uber-trace-id'
    this.headersToPropagate = tracingInfo.headersToPropagate
  }

  getCurrentSpan(): Span | void {
    if (this.localTracer.currentTrace) {
      return this.localTracer.currentTrace.context.get(this.CURRENT_SPAN_KEY)
    }

    return undefined
  }

  setGlobalTracingId(id: string) {
    if (this.localTracer.currentTrace) {
      this.localTracer.currentTrace.context.set(this.globalTracingKey, id)
    }
  }

  setCurrentSpan(span: Span) {
    if (this.localTracer.currentTrace) {
      this.localTracer.currentTrace.context.set(this.CURRENT_SPAN_KEY, span)

      // also save global tracing id
      this.setGlobalTracingId(span.context().toString())
    }
  }

  /**
   * This is used by http client headers propagation
   */
  getGlobalTracingId() {
    if (this.localTracer.currentTrace) {
      return this.localTracer.currentTrace.context.get(this.globalTracingKey)
    }
  }

  getLocalTracingKey() {
    return this.localTracingKey
  }

  setLocalTracingId(id: string) {
    if (this.localTracer.currentTrace) {
      this.localTracer.currentTrace.context.set(this.getLocalTracingKey(), id)
    }
  }

  setTags(span: Span, tags?: ITags) {
    if (tags) {
      Object.keys(tags).forEach((key) => span.setTag(key, tags[key]))
    }
  }

  injectPropagatingValues(headers: any) {
    const currentTrace = this.localTracer.currentTrace

    if (currentTrace) {
      this.headersToPropagate.forEach((key) => {
        const value = currentTrace.context.get(key)

        if (value) {
          headers[key] = value
        }
      })
    }
  }

  injectCurrentSpan(headers: any) {
    const span = this.getCurrentSpan()

    if (span) {
      this.globalTracer.inject(span, FORMAT_TEXT_MAP, headers)
    }
  }

  injectTracingContext(headers: any) {
    this.injectCurrentSpan(headers)
    this.injectPropagatingValues(headers)
  }

  extractCurrentSpan(headers: any) {
    if (headers) {
      const currentSpan = this.globalTracer.extract(FORMAT_TEXT_MAP, headers)

      if (currentSpan && currentSpan.toSpanId()) {
        return currentSpan
      }
    }

    return undefined
  }

  startNewLocalTracer(type: string, contextValues: { [key: string]: string } = {}) {
    const newLocalTracer = this.localTracer.newTrace(type)

    newLocalTracer.context = new Map(Object.entries(contextValues))

    const localTracingId = newLocalTracer.context.get(this.getLocalTracingKey()) || uuid.v4()
    newLocalTracer.context.set(this.getLocalTracingKey(), localTracingId)

    return newLocalTracer
  }

  extractPropagatingValues(headers: any) {
    const values: { [key: string]: string } = {}

    this.headersToPropagate.forEach((key) => {
      const value = headers[key]

      if (value) {
        values[key] = value
      }
    })

    return values
  }

  extractTracingContext(headers: any) {
    return {
      currentSpan: this.extractCurrentSpan(headers),
      propagatingValues: this.extractPropagatingValues(headers),
    }
  }

  startNewLocalTracer(type: string, contextValues: { [key: string]: string } = {}) {
    const newLocalTracer = this.localTracer.newTrace(type)

    newLocalTracer.context = new Map(Object.entries(contextValues))

    const localTracingId = newLocalTracer.context.get(this.getLocalTracingKey()) || uuid.v4()
    newLocalTracer.context.set(this.getLocalTracingKey(), localTracingId)

    return newLocalTracer
  }

  getLocalTracingId(): string | void {
    if (this.localTracer.currentTrace) {
      return this.localTracer.currentTrace.context.get(this.getLocalTracingKey())
    }

    return undefined
  }

  startSpan(name: string, options: ISpanOptions = {}) {
    const { currentSpan, tags, logs } = options

    const span = this.globalTracer.startSpan(name, { childOf: currentSpan })

    const localTracingId = this.getLocalTracingId()
    // console.log('localTracingId', localTracingId)

    if (localTracingId) {
      span.setTag(this.getLocalTracingKey(), localTracingId)
    }

    this.setTags(span, tags)

    if (logs) {
      logs.forEach((log) => span.log(log))
    }

    return span
  }

  startSpanFromCtx(ctx: Context) {
    //###### extract global context
    const currentSpan = this.globalTracer.extract(FORMAT_HTTP_HEADERS, ctx.headers) || undefined

    //###### prepare new span
    // tslint:disable-next-line: no-http-string
    const name = `http: ${ctx.path}`

    const tags: ITags = {
      [Tags.HTTP_URL]: ctx.url,
      [Tags.HTTP_METHOD]: ctx.method,
    }

    //###### start new span
    const span = this.startSpan(name, {
      currentSpan,
      tags,
    })

    //###### forwarding new context
    // Send span context via request headers (parent id etc.)
    this.globalTracer.inject(span, FORMAT_HTTP_HEADERS, ctx.headers)

    //###### new context as current context
    this.setCurrentSpan(span)

    return span
  }

  startSpanFromHeader(
    name: string,
    headers: any,
    options: { tags?: ITags, logs?: any[], type?: string } = {},
  ) {
    const { type = 'headers', tags = {}, logs = [] } = options

    // extract context from headers
    const { currentSpan, propagatingValues } = this.extractTracingContext(headers)

    // start new local tracer since we get context from external source (headers)
    this.startNewLocalTracer(type, propagatingValues)

    let span: Span

    if (currentSpan) {
      span = this.startSpan(name, {
        currentSpan,
        tags,
        logs,
      })

      // forwarding context
      this.setCurrentSpan(span)
    }

    return span
  }

  finishSpanFromCtx(span: Span, ctx: Context, err?: any) {
    const tags = {
      [Tags.HTTP_STATUS_CODE]: `${ctx.status}`,
    }
    this.finishSpan(span, err, tags)
  }

  finishSpan(span: Span, err?: any, tags?: ITags) {
    if (err) {
      span.setTag(Tags.ERROR, true)
      span.log({
        event: 'error',
        message: err.message,
        err,
      })
    }

    this.setTags(span, tags)

    span.finish()
  }
}
