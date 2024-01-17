import { GetActorsApiRequestDto } from './Api/GetActorsApiRequestDto'
import { GetActorsApplicationRequestDto } from '~/modules/Actors/Application/GetActors/GetActorsApplicationRequestDto'

export class GetActorsRequestDtoTranslator {
  public static fromApiDto (request: GetActorsApiRequestDto): GetActorsApplicationRequestDto {
    return {
      sortOption: request.orderBy,
      page: request.page,
      actorsPerPage: request.perPage,
      sortCriteria: request.order,
    }
  }
}
