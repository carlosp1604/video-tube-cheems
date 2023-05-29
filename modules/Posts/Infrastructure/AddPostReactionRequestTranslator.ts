import { AddPostReactionApiRequest } from '~/modules/Posts/Infrastructure/Dtos/AddPostReactionApiRequest'
import {
  AddPostReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostReaction/AddPostReactionApplicationRequest'

export class AddPostReactionRequestTranslator {
  public static fromApiDto (request: AddPostReactionApiRequest): AddPostReactionApplicationRequest {
    return {
      postId: request.postId,
      userId: request.userId,
      reactionType: request.reactionType,
    }
  }
}
