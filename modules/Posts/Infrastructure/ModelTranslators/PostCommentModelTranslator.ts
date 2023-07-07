import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PrismaUserModelTranslator } from '~/modules/Auth/Infrastructure/PrismaUserModelTranslator'
import {
  PostCommentWithChilds, PostCommentWithUser
} from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { User } from '~/modules/Auth/Domain/User'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import {
  PostChildCommentModelTranslator
} from '~/modules/Posts/Infrastructure/ModelTranslators/PostChildCommentModelTranslator'

export class PostCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: RepositoryOptions[]
  ): PostComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    let user: Relationship<User> = Relationship.notLoaded()
    let childrenCollection: Collection<PostChildComment, PostChildComment['id']> = Collection.notLoaded()

    if (options.includes('comments.user')) {
      const postCommentWithUser = prismaPostCommentModel as PostCommentWithUser
      const userDomain = PrismaUserModelTranslator.toDomain(postCommentWithUser.user)

      user = Relationship.initializeRelation(userDomain)
    }

    if (options.includes('comments.childComments')) {
      const postCommentWithChildren = prismaPostCommentModel as PostCommentWithChilds

      childrenCollection = Collection.initializeCollection()

      postCommentWithChildren.childComments.forEach((childComment) => {
        childrenCollection.addItemFromPersistenceLayer(
          PostChildCommentModelTranslator.toDomain(childComment, ['comments.user']),
          childComment.userId
        )
      })
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
      childrenCollection
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
