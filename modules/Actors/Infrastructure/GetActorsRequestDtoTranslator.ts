import { GetActorsApiRequestDto } from './Api/GetActorsApiRequestDto'
import { GetActorsApplicationRequestDto } from '~/modules/Actors/Application/GetActors/GetActorsApplicationRequestDto'

export class GetActorsRequestDtoTranslator {
  public static fromApiDto (request: GetActorsApiRequestDto): GetActorsApplicationRequestDto {
    return {
      sortOption: request.sortOption,
      page: request.page,
      actorsPerPage: request.actorsPerPage,
      sortCriteria: request.sortCriteria,
      // TODO: FIX THIS
      filters: [],
    }
  }
}
