import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'
import { prisma } from '~/persistence/prisma'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'

export class MysqlReactionRepository implements ReactionRepositoryInterface {
  /**
   * Insert a Reaction in the persistence layer or update if already exists
   * @param reaction Reaction to persist
   */
  public async save (reaction: Reaction): Promise<void> {
    const prismaModel = ReactionModelTranslator.toDatabase(reaction)

    await prisma.reaction.upsert({
      where: {
        reactionableType_reactionableId_userId: {
          reactionableId: reaction.reactionableId,
          userId: reaction.userId,
          reactionableType: reaction.reactionableType,
        },
      },
      create: {
        ...prismaModel,
      },
      update: {
        reactionType: prismaModel.reactionType,
        updatedAt: prismaModel.updatedAt,
      },
    })
  }

  /**
   * Remove a Reaction from the persistence layer
   * @param postCommentId PostComment ID
   * @param userId User ID
   */
  public async remove (postCommentId: Reaction['reactionableId'], userId: Reaction['userId']): Promise<void> {
    await prisma.reaction.delete({
      where: {
        reactionableType_reactionableId_userId: {
          reactionableId: postCommentId,
          reactionableType: ReactionableType.POST_COMMENT,
          userId,
        },
      },
    })
  }
}
