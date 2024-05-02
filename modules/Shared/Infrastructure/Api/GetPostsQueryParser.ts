import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import {
  GetPostsApiFilterRequestDto,
  GetPostsApiRequestDto
} from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestDto'
import { PostFilterStringTypeOptions } from '~/modules/Shared/Domain/Posts/PostFilterOption'

export class GetPostsQueryParser {
  public static parseQuery (query: NextApiRequestQuery): Partial<GetPostsApiRequestDto> {
    const {
      page,
      perPage,
      order,
      orderBy,
    } = query

    const filters: GetPostsApiFilterRequestDto[] = []

    for (const filter of Object.values(PostFilterStringTypeOptions)) {
      const queryFilter = query[`${filter}`]

      if (queryFilter) {
        filters.push({
          type: filter,
          value: String(queryFilter),
        })
      }
    }

    return {
      ...page ? { page: parseInt(String(page)) } : {},
      ...perPage ? { perPage: parseInt(String(perPage)) } : {},
      ...orderBy ? { orderBy: String(orderBy) } : {},
      ...order ? { order: String(order) } : {},
      filters,
    }
  }
}
