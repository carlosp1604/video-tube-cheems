import { CreatePostReactionApiRequest } from '~/modules/Posts/Infrastructure/Dtos/CreatePostReactionApiRequest'
import {
  CreatePostReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationRequest'

export class CreatePostReactionRequestTranslator {
  public static fromApiDto (request: CreatePostReactionApiRequest): CreatePostReactionApplicationRequest {
    return {
      postId: request.postId,
      userId: request.userId,
      reactionType: request.reactionType,
    }
  }
}
