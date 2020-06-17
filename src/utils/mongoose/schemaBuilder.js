import {
  Document,
  DocumentToObjectOptions,
  model,
  Schema,
  SchemaDefinition,
  SchemaOptions,
} from 'mongoose'

/**
 * apply function transform to toObject() to convert _id from ObjectID to string
 */
const toObjectOptions: DocumentToObjectOptions = {
  transform: (_doc, ret, _options) => {
    if (ret._id) {
      ret._id = ret._id.toString()
    }
    return ret
  },
}

const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toObject: toObjectOptions,
}

export function buildSchema<T>(
  name: string,
  schemaDef: SchemaDefinition,
  additionalSchemaOptions?: SchemaOptions,
) {
  const options = Object.assign({}, defaultSchemaOptions, additionalSchemaOptions)

  const schema = new Schema(schemaDef, options)

  return (model < T) & (Document > (name, schema))
}
