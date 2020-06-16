// @flow
import { Span, SpanContext, Tracer } from 'opentracing'

export interface ICurrentTrace {
  context: Map<any, any>;
}

export interface ILocalTracer {
  currentTrace?: ICurrentTrace;
  traces: Object;
  newTrace: (type: string) => ICurrentTrace;
}

export type ITags = Object

export interface ISpanOptions {
  tags?: Object;
  logs?: any[];
  currentSpan?: Span | SpanContext;
}

export interface ILocalTracingInfo {
  localTracer: ILocalTracer;
  localTracingKey?: string;
}

export interface ITracingInfo extends ILocalTracingInfo {
  headersToPropagate: string[];
  globalTracer: Tracer;
  globalTracingKey?: string;
}
