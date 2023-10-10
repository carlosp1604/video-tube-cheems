import {
  GetPostUserInteractionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostUserInteractionApiRequestDto'
import {
  GetPostUserReactionApplicationRequest
} from '~/modules/Posts/Application/GetPostUserReaction/GetPostUserReactionApplicationRequest'

export class GetPostUserInteractionDtoTranslator {
  public static fromApiDto (request: GetPostUserInteractionApiRequestDto): GetPostUserReactionApplicationRequest {
    return {
      postId: request.postId,
      userId: request.userId,
    }
  }
}
