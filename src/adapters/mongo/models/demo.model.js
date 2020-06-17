import mongoose from 'mongoose'
// import { IDemo } from '../../../domains/demo/interface'
// import { buildSchema } from '../../../utils/mongoose/schemaBuilder'

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: false },
  authorEmail: { type: String, required: true },
})

export default mongoose.model('Demo', schema)
