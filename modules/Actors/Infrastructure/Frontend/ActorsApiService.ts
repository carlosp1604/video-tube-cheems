import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'
import { GetActorsApplicationDto } from '~/modules/Actors/Application/GetActorsApplicationDto'

export class ActorsApiService {
  public async getActors (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchPostsFilter[]
  ): Promise<GetActorsApplicationDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return ((await fetch(`/api/actors${params}`)).json())
  }
}
