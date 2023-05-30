import { DateTime } from 'luxon'
import { UserModelTranslator } from '../../../Auth/Infrastructure/UserModelTranslator'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { RepositoryOptions } from '../../Domain/PostRepositoryInterface'
import { PostCommentWithUser } from '../PrismaModels/PostCommentModel'
import { PostChildComment } from '../../Domain/PostChildComment'

export class PostChildCommentModelTranslator {
  public static toDomain(
    prismaPostCommentModel: PrismaPostCommentModel,
    options: RepositoryOptions[]
  ): PostChildComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    const postComment = new PostChildComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      prismaPostCommentModel.userId,
      // if it's a child comment we are sure the parentCommentId is not null
      prismaPostCommentModel.parentCommentId as string,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt
    )

    if (options.includes('comments.user')) {
      const postCommentWithUser = prismaPostCommentModel as PostCommentWithUser
      const userDomain = UserModelTranslator.toDomain(postCommentWithUser.user)
      postComment.setUser(userDomain)
    }

    return postComment
  }

  public static toDatabase(postChildComment: PostChildComment): PrismaPostCommentModel {
    return {
      id: postChildComment.id,
      comment: postChildComment.comment,
      userId: postChildComment.userId,
      parentCommentId: postChildComment.parentCommentId,
      createdAt: postChildComment.createdAt.toJSDate(),
      deletedAt: postChildComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postChildComment.updatedAt.toJSDate(),
      postId: null
    }
  }
}