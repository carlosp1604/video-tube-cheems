import { GetPostsApiRequestDto } from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestDto'
import { GetPostsApplicationRequestDto } from '~/modules/Shared/Application/GetPostsApplicationRequestDto'

export class GetPostsRequestDtoTranslator {
  public static fromApiDto (request: GetPostsApiRequestDto): GetPostsApplicationRequestDto {
    return {
      sortOption: request.orderBy,
      page: request.page,
      postsPerPage: request.perPage,
      sortCriteria: request.order,
      filters: request.filters,
    }
  }
}
