import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  GetProducersApplicationResponseDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationResponseDto'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { ProducerFilterOptions } from '~/modules/Producers/Infrastructure/Frontend/ProducerFilterOptions'

export class ProducersApiService {
  public async getProducers (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchFilter<ProducerFilterOptions>[]
  ): Promise<GetProducersApplicationResponseDto> {
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

    return ((await fetch(`/api/producers?${params}`)).json())
  }

  public async addProducerView (producerId: string): Promise<Response> {
    return fetch(`/api/producers/${producerId}/producer-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
