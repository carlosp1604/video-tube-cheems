import { GetPostsRequestDto } from '../Application/Dtos/GetPostsRequestDto'
import { GetPostsApiRequestDto } from './Dtos/GetPostsApiRequestDto'

export class GetPostsRequestDtoTranslator {
  public static fromApiDto(request: GetPostsApiRequestDto): GetPostsRequestDto {
    return {
      sortOption: request.sortOption,
      page: request.page,
      postsPerPage: request.postsPerPage,
      sortCriteria: request.sortCriteria,
      filters: request.filters,
    }
  }
}