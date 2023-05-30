import { ReactionApplicationDto } from '~/modules/Posts/Application/Dtos/ReactionApplicationDto'
import { PostReaction } from '~/modules/Posts/Domain/PostReaction'

export class ReactionApplicationDtoTranslator {
  public static fromDomain (reaction: PostReaction): ReactionApplicationDto {
    return {
      reactionType: reaction.reactionType,
      postId: reaction.postId,
      createdAt: reaction.createdAt.toISO(),
      userId: reaction.userId,
      updatedAt: reaction.updatedAt.toISO(),
    }
  }
}
