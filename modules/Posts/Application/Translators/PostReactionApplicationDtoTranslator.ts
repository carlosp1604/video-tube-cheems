import { PostReaction } from '~/modules/Posts/Domain/PostReaction'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'

export class PostReactionApplicationDtoTranslator {
  public static fromDomain (postReaction: PostReaction): PostReactionApplicationDto {
    return {
      postId: postReaction.postId,
      userId: postReaction.userId,
      reactionType: postReaction.reactionType,
    }
  }
}
