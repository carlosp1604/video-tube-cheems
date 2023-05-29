import { GetPostsApiRequestDto } from './Dtos/GetPostsApiRequestDto'
import { GetPostsRequestDto } from '~/modules/Posts/Application/GetPosts/GetPostsRequestDto'

export class GetPostsRequestDtoTranslator {
  public static fromApiDto (request: GetPostsApiRequestDto): GetPostsRequestDto {
    return {
      sortOption: request.sortOption,
      page: request.page,
      postsPerPage: request.postsPerPage,
      sortCriteria: request.sortCriteria,
      filters: request.filters,
    }
  }
}
