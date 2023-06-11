import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PrismaUserModelTranslator } from '~/modules/Auth/Infrastructure/PrismaUserModelTranslator'
import {
  PostCommentWithChilds, PostCommentWithUser
} from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'

export class PostCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: RepositoryOptions[]
  ): PostComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    const postComment = new PostComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      // if it's a comment we are sure the postId is not null
      prismaPostCommentModel.postId as string,
      prismaPostCommentModel.userId,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt
    )

    if (options.includes('comments.user')) {
      const postCommentWithUser = prismaPostCommentModel as PostCommentWithUser
      const userDomain = PrismaUserModelTranslator.toDomain(postCommentWithUser.user)

      postComment.setUser(userDomain)
    }

    if (options.includes('comments.childComments')) {
      const postCommentWithChilds = prismaPostCommentModel as PostCommentWithChilds

      postCommentWithChilds.childComments.forEach((childComment) => {
        postComment.addChildComment(
          childComment.comment,
          childComment.userId)
      })
    }

    return postComment
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
