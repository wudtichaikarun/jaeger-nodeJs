import { Document, FilterQuery, Model } from 'mongoose'

export interface IPageable {
  page: number
  pageSize: number
  count: number
  total: number
  totalPages: number
  hasNext: boolean
}

export interface IPaginationRequest {
  page: number
  limit: number
  sort?: Object | string
}

export interface IPage<T> {
  documents: T
  pageable: IPageable
}

const DEFAULT_LIMIT = 25

export async function findWithPagination<T extends Document> (
  model: Model<T>,
  conditions: FilterQuery<any>,
  paginationRequest: IPaginationRequest
): Promise<IPage<T[]>> {
  const { sort, page } = paginationRequest
  const limit: number = paginationRequest.limit || DEFAULT_LIMIT
  const skip: number = (page - 1) * limit

  const queryBuilder = model.find(conditions)
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const countDocuments =  model.countDocuments(conditions)

  const [ documents, totalDocuments ] = await Promise.all([
    queryBuilder.exec(),
    countDocuments
  ])

  const totalPages = Math.ceil(totalDocuments / limit) || 1
  const hasNext = page < totalPages ? true : false

  const pageable: IPageable = {
    page: page,
    pageSize: limit,
    count: documents.length,
    total: totalDocuments,
    totalPages: totalPages,
    hasNext
  }

  const paginateResult: IPage<T[]> = {
    documents: documents as T[],
    pageable
  }

  return paginateResult
}
