// @flow
import R from 'ramda'
import * as uuid from 'uuid'
import axios from 'axios'
import { traceUtil } from '../../../bootstrapTracer'

interface IRequest {
  methodA(): Promise<void>;
  methodB(): Promise<void>;
  process(): Promise<any>;
}

class Request implements IRequest {
  async methodA() {
    const span = traceUtil.startSpan('methodA', { currentSpan: traceUtil.getCurrentSpan() })

    const valueA = await axios.request({
      url: 'https://run.mocky.io/v3/bb55143e-6ef2-4fbf-b11a-d2d948d32d9e',
      method: 'GET',
    })

    span.finish()
    return valueA.data
  }

  async methodB() {
    const span = traceUtil.startSpan('methodB', { currentSpan: traceUtil.getCurrentSpan() })

    const valueB = await axios.request({
      url: 'https://run.mocky.io/v3/bb55143e-6ef2-4fbf-b11a-d2d948d32d9e',
      method: 'GET',
    })

    span.finish()
    return valueB.data
  }

  async process() {
    const responseA = await this.methodA()
    const responseB = await await this.methodB()

    return {
      dataA: responseA,
      dataB: responseB,
    }
  }
}

export const request = new Request()
