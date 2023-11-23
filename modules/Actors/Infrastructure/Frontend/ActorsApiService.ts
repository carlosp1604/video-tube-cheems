import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import { GetActorsApplicationDto } from '~/modules/Actors/Application/GetActorsApplicationDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'

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
