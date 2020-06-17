import { IDemo, IDemoRequest } from '../../domains/demo/interface'

export interface IDemoRepository {
  // findAll(): Promise<IDemo[]>;
  // findByName(name: string): Promise<IDemo | null>;
  create(model: IDemoRequest): Promise<IDemo>;
}
