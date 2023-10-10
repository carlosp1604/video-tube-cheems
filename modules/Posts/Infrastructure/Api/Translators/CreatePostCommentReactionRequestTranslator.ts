import {
  CreatePostCommentReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentReactionApiRequestDto'
import {
  CreatePostCommentReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReactionApplicationRequest'

export class CreatePostCommentReactionRequestTranslator {
  public static fromApiDto (request: CreatePostCommentReactionApiRequestDto): CreatePostCommentReactionApplicationRequest {
    return {
      postCommentId: request.postCommentId,
      userId: request.userId,
      parentCommentId: request.parentCommentId,
    }
  }
}
