import { PostReactionComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostReactionComponentDto'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'

export class PostReactionComponentDtoTranslator {
  public static fromApplicationDto (postReaction: PostReactionApplicationDto): PostReactionComponentDto {
    return {
      postId: postReaction.postId,
      userId: postReaction.userId,
      reactionType: postReaction.reactionType,
    }
  }
}
