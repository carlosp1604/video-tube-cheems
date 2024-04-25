import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  GetProducersApplicationResponseDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationResponseDto'

export class ProducersApiService {
  public async getProducers (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions
  ): Promise<GetProducersApplicationResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

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
