import { GetActorsRequestDto } from '../Application/GetActorsRequestDto'
import { GetActorsApiRequestDto } from './GetActorsApiRequestDto'

export class GetActorsRequestDtoTranslator {
  public static fromApiDto(request: GetActorsApiRequestDto): GetActorsRequestDto {
    return {
      sortOption: request.sortOption,
      page: request.page,
      actorsPerPage: request.actorsPerPage,
      sortCriteria: request.sortCriteria,
      filters: request.filters,
    }
  }
}