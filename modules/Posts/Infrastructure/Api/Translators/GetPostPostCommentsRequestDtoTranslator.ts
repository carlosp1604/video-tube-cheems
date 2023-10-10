
import {
  GetPostPostCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostCommentsApiRequestDto'
import {
  GetPostPostCommentsApplicationRequest
} from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationRequest'

export class GetPostPostCommentsRequestDtoTranslator {
  public static fromApiDto (
    request: GetPostPostCommentsApiRequestDto,
    userId: string | null
  ): GetPostPostCommentsApplicationRequest {
    return {
      page: request.page,
      perPage: request.perPage,
      postId: request.postId,
      userId,
    }
  }
}
