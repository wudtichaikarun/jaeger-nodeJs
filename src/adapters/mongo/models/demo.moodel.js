import { Schema } from 'mongoose'
import { IDemo } from '../../../domains/demo/interface'
import { buildSchema } from '../../../utils/mongoose/schemaBuilder'

const schema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: false },
  authorEmail: { type: String, required: true },
  presentDate: { type: Date, required: true },
})

export default buildSchema < IDemo > ('Demo', schema)
