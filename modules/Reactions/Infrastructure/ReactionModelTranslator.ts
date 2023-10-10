import { DateTime } from 'luxon'
import { Reaction as PrismaReactionModel } from '@prisma/client'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class ReactionModelTranslator {
  public static toDomain (prismaReactionModel: PrismaReactionModel): Reaction {
    let deletedAt: DateTime | null = null

    if (prismaReactionModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaReactionModel.deletedAt)
    }

    return new Reaction(
      prismaReactionModel.reactionableId,
      prismaReactionModel.reactionableType,
      prismaReactionModel.userId,
      prismaReactionModel.reactionType,
      DateTime.fromJSDate(prismaReactionModel.createdAt),
      DateTime.fromJSDate(prismaReactionModel.updatedAt),
      deletedAt
    )
  }

  public static toDatabase (reaction: Reaction): PrismaReactionModel {
    return {
      reactionType: reaction.reactionType,
      userId: reaction.userId,
      createdAt: reaction.createdAt.toJSDate(),
      deletedAt: reaction.deletedAt?.toJSDate() ?? null,
      updatedAt: reaction.updatedAt.toJSDate(),
      reactionableId: reaction.reactionableId,
      reactionableType: reaction.reactionableType,
    }
  }
}
