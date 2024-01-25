import { GetProducersApiRequestDto } from '~/modules/Producers/Infrastructure/Api/GetProducersApiRequestDto'
import {
  GetProducersApplicationRequestDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationRequestDto'

export class GetProducersRequestDtoTranslator {
  public static fromApiDto (request: GetProducersApiRequestDto): GetProducersApplicationRequestDto {
    return {
      sortOption: request.orderBy,
      page: request.page,
      producersPerPage: request.perPage,
      sortCriteria: request.order,
    }
  }
}
