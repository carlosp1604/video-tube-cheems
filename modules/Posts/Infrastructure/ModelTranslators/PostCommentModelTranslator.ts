import { DateTime } from 'luxon'
import { PostComment } from '../../Domain/PostComment'
import { UserModelTranslator } from '../../../Auth/Infrastructure/UserModelTranslator'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { RepositoryOptions } from '../../Domain/PostRepositoryInterface'
import { PostCommentWithChilds, PostCommentWithUser } from '../PrismaModels/PostCommentModel'
import { PostChildCommentModelTranslator } from './PostChildCommentModelTranslator'

export class PostCommentModelTranslator {
  public static toDomain(
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
      const userDomain = UserModelTranslator.toDomain(postCommentWithUser.user)
      postComment.setUser(userDomain)
    }

    if (options.includes('comments.childComments')) {
      const postCommentWithChilds = prismaPostCommentModel as PostCommentWithChilds
      postCommentWithChilds.childComments.forEach((childComment) => {
        postComment.addChildComment(PostChildCommentModelTranslator.toDomain(childComment, ['comments.user']))
      })
    }

    return postComment
  }

  public static toDatabase(postComment: PostComment): PrismaPostCommentModel {
    return {
      id: postComment.id,
      comment: postComment.comment,
      userId: postComment.userId,
      parentCommentId: null,
      createdAt: postComment.createdAt.toJSDate(),
      deletedAt: postComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postComment.updatedAt.toJSDate(),
      postId: postComment.postId
    }
  }
}