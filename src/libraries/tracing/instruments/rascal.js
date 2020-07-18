// import rascal from 'rascal'
// var shimmer = require('shimmer')
// import { Broker } from '../../amqp/index'

// const config = {
//   options: {
//     headers: {
//       'uber-trace-id': '6d6ae53f14e1a1cf:b5bbc24596fb3870:6d6ae53f14e1a1cf:1',
//       'x-correlation-id': '73455230-1a12-4956-a7fb-23324064ecc5',
//     },
//   },
// }

// shimmer.wrap(rascal, 'publish', function (original) {
//   return function () {
//     console.log('Starting request!')
//     const returned = original.apply(this, [...arguments, config])
//     console.log('Done setting up request -- OH YEAH!')
//     return returned
//   }
// })
