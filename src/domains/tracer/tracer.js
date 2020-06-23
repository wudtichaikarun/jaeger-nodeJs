// @flow
import R from 'ramda'
import * as uuid from 'uuid'
import axios from 'axios'

interface IRequest {
  methodA(): Promise<void>;
  methodB(): Promise<void>;
  process(): Promise<any>;
}

export class Request implements IRequest {
  async methodA() {
    const valueA = await axios.request({
      url: 'https://run.mocky.io/v3/bb55143e-6ef2-4fbf-b11a-d2d948d32d9e',
      method: 'GET',
    })

    return valueA.data
  }

  async methodB() {
    const valueB = await axios.request({
      url: 'https://run.mocky.io/v3/bb55143e-6ef2-4fbf-b11a-d2d948d32d9e',
      method: 'GET',
    })

    return valueB.data
  }

  async process() {
    const [responseA, responseB] = await Promise.all([this.methodA(), this.methodB()])
    // const responseA = await this.methodA()
    // const responseB = await this.methodB()

    return {
      dataA: responseA,
      dataB: responseB,
    }
  }
}

const tracerDomain = new Request()
export default tracerDomain
