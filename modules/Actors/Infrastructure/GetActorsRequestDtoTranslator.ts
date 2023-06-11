import { GetActorsApiRequestDto } from './GetActorsApiRequestDto'
import { GetActorsRequestDto } from '~/modules/Actors/Application/GetActorsRequestDto'

export class GetActorsRequestDtoTranslator {
  public static fromApiDto (request: GetActorsApiRequestDto): GetActorsRequestDto {
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
