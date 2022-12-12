import { ReactionApplicationDto } from '../Dtos/ReactionApplicationDto'
import { PostReaction } from '../../Domain/PostReaction'

export class ReactionApplicationDtoTranslator {
  public static fromDomain(reaction: PostReaction): ReactionApplicationDto {
    return {
      reactionType: reaction.reactionType,
      postId: reaction.postId,
      createdAt: reaction.createdAt.toISO(),
      userId: reaction.userId,
      updatedAt: reaction.updatedAt.toISO()
    }
  }
}