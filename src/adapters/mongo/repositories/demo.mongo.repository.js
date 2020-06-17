import { IDemo, IDemoRequest } from '../../../domains/demo/interface'
import { IDemoRepository } from '../../../repositories/demo/demo.repository'
import demoModel from '../models/demo.model'

export class DemoMongoRepository implements IDemoRepository {
  //   async findAll(): Promise<IDemo[]> {
  //     const results = await demoModel.find({})

  //     return results.map((r) => r.toObject())
  //   }

  async create(request: IDemoRequest): Promise<IDemo> {
    console.log('demoModel', demoModel)

    const result = await demoModel.create(request)

    return result
  }

  //   async findByName(name: string): Promise<IDemo | null> {
  //     const result = await demoModel.findOne({ name, presentDate: { $gt: new Date() } })
  //     return result?.toObject()
  //   }

  //   async save(model: IDemo): Promise<IDemo | null> {
  //     const filter = { name: model.name }
  //     const result = await demoModel.findOneAndUpdate(filter, model, { upsert: true })

  //     return result?.toObject()
  //   }
}
