import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import {
  PostCommentWithReactions,
  PostCommentWithUser
} from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'
import { PrismaUserModelTranslator } from '~/modules/Auth/Infrastructure/PrismaUserModelTranslator'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { User } from '~/modules/Auth/Domain/User'
import { PostCommentRepositoryOption } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class PostChildCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: PostCommentRepositoryOption[]
  ): PostChildComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    let user: Relationship<User> = Relationship.notLoaded()
    let reactionsCollection: Collection<Reaction, Reaction['userId']> = Collection.notLoaded()

    if (options.includes('comments.user')) {
      const postCommentWithUser = prismaPostCommentModel as PostCommentWithUser
      const userDomain = PrismaUserModelTranslator.toDomain(postCommentWithUser.user)

      user = Relationship.initializeRelation(userDomain)
    }

    if (options.includes('comments.reactions')) {
      const postCommentWithReactions = prismaPostCommentModel as PostCommentWithReactions

      reactionsCollection = Collection.initializeCollection()

      for (const reaction of postCommentWithReactions.reactions) {
        const domainReaction = ReactionModelTranslator.toDomain(reaction)

        reactionsCollection.addItem(domainReaction, domainReaction.userId)
      }
    }

    return new PostChildComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      prismaPostCommentModel.userId,
      // if it's a child comment we are sure the parentCommentId is not null
      prismaPostCommentModel.parentCommentId as string,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt,
      user,
      reactionsCollection
    )
  }

  public static toDatabase (postChildComment: PostChildComment): PrismaPostCommentModel {
    return {
      id: postChildComment.id,
      comment: postChildComment.comment,
      userId: postChildComment.userId,
      parentCommentId: postChildComment.parentCommentId,
      createdAt: postChildComment.createdAt.toJSDate(),
      deletedAt: postChildComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postChildComment.updatedAt.toJSDate(),
      postId: null,
    }
  }
}
