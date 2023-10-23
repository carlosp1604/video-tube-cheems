import {
  GetPostUserInteractionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostUserInteractionApiRequestDto'
import {
  GetPostUserInteractionApplicationRequest
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationRequest'

export class GetPostUserInteractionDtoTranslator {
  public static fromApiDto (request: GetPostUserInteractionApiRequestDto): GetPostUserInteractionApplicationRequest {
    return {
      postId: request.postId,
      userId: request.userId,
    }
  }
}
