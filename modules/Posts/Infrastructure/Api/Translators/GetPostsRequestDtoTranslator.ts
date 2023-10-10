import { GetPostsApiRequestDto } from '../../Dtos/GetPostsApiRequestDto'
import { GetPostsRequestDto } from '~/modules/Posts/Application/GetPosts/GetPostsRequestDto'

export class GetPostsRequestDtoTranslator {
  public static fromApiDto (request: GetPostsApiRequestDto): GetPostsRequestDto {
    return {
      sortOption: request.orderBy,
      page: request.page,
      postsPerPage: request.perPage,
      sortCriteria: request.order,
      filters: request.filters,
    }
  }
}
