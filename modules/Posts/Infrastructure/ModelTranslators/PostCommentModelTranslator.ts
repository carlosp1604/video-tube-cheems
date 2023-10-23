import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PrismaUserModelTranslator } from '~/modules/Auth/Infrastructure/PrismaUserModelTranslator'
import {
  PostCommentWithChilds, PostCommentWithReactions, PostCommentWithUser
} from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { User } from '~/modules/Auth/Domain/User'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import {
  PostChildCommentModelTranslator
} from '~/modules/Posts/Infrastructure/ModelTranslators/PostChildCommentModelTranslator'
import { PostCommentRepositoryOption } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'

export class PostCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: PostCommentRepositoryOption[]
  ): PostComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    let user: Relationship<User> = Relationship.notLoaded()
    let childrenCollection: Collection<PostChildComment, PostChildComment['id']> = Collection.notLoaded()
    let reactionsCollection: Collection<Reaction, Reaction['userId']> = Collection.notLoaded()

    if (options.includes('comments.user')) {
      const postCommentWithUser = prismaPostCommentModel as PostCommentWithUser
      const userDomain = PrismaUserModelTranslator.toDomain(postCommentWithUser.user)

      user = Relationship.initializeRelation(userDomain)
    }

    if (options.includes('comments.childComments')) {
      const postCommentWithChildren = prismaPostCommentModel as PostCommentWithChilds

      childrenCollection = Collection.initializeCollection()

      postCommentWithChildren.childComments.forEach((childComment) => {
        childrenCollection.addItem(
          PostChildCommentModelTranslator.toDomain(childComment, ['comments.user']),
          childComment.id
        )
      })
    }

    if (options.includes('comments.reactions')) {
      const postCommentWithReactions = prismaPostCommentModel as PostCommentWithReactions

      reactionsCollection = Collection.initializeCollection()

      for (const reaction of postCommentWithReactions.reactions) {
        const domainReaction = ReactionModelTranslator.toDomain(reaction)

        reactionsCollection.addItem(domainReaction, domainReaction.userId)
      }
    }

    return new PostComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      // if it's a PostComment we are sure the postId is not null
      prismaPostCommentModel.postId as string,
      prismaPostCommentModel.userId,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt,
      user,
      childrenCollection,
      reactionsCollection
    )
  }

  public static toDatabase (postComment: PostComment): PrismaPostCommentModel {
    return {
      id: postComment.id,
      comment: postComment.comment,
      userId: postComment.userId,
      parentCommentId: null,
      createdAt: postComment.createdAt.toJSDate(),
      deletedAt: postComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postComment.updatedAt.toJSDate(),
      postId: postComment.postId,
    }
  }
}
