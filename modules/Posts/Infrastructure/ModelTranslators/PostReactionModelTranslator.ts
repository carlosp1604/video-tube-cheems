import { DateTime } from 'luxon'
import { PostReaction as PrismaPostReactionModel } from '@prisma/client'
import { PostReaction, Reaction } from '~/modules/Posts/Domain/PostReaction'

export class PostReactionModelTranslator {
  public static toDomain (prismaPostReactionModel: PrismaPostReactionModel): PostReaction {
    let deletedAt: DateTime | null = null

    if (prismaPostReactionModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostReactionModel.deletedAt)
    }

    return new PostReaction(
      prismaPostReactionModel.postId,
      prismaPostReactionModel.userId,
      prismaPostReactionModel.reactionType as Reaction,
      DateTime.fromJSDate(prismaPostReactionModel.createdAt),
      DateTime.fromJSDate(prismaPostReactionModel.updatedAt),
      deletedAt
    )
  }

  public static toDatabase (postReaction: PostReaction): PrismaPostReactionModel {
    return {
      reactionType: postReaction.reactionType,
      userId: postReaction.userId,
      createdAt: postReaction.createdAt.toJSDate(),
      deletedAt: postReaction.deletedAt?.toJSDate() ?? null,
      updatedAt: postReaction.updatedAt.toJSDate(),
      postId: postReaction.postId,
    }
  }
}
