import { PostChildCommentModelTranslator } from './ModelTranslators/PostChildCommentModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import {
  PostCommentWithCountAndUserInteraction
} from '~/modules/Posts/Domain/PostComments/PostCommentWithCountInterface'
import { prisma } from '~/persistence/prisma'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { Reaction, ReactionType } from '~/modules/Reactions/Domain/Reaction'
import {
  PostChildCommentWithReactionCountAndUserInteraction
} from '~/modules/Posts/Domain/PostComments/PostChildCommentWithReactionCountAndUserInteraction'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { Prisma } from '.prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import PostCommentInclude = Prisma.PostCommentInclude;
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'

export class MysqlPostCommentRepository implements PostCommentRepositoryInterface {
  /**
   * Find Comments based on its postId (includes user model, childComments count and reactions (like) count)
   * Retrieves user reaction if userId is not null
   * @param postId Post ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @param userId User ID
   * @return Array of PostCommentWithCountAndUserInteraction
   */
  public async findWithOffsetAndLimit (
    postId: Post['id'],
    offset: number,
    limit: number,
    userId: PostComment['userId'] | null
  ): Promise<PostCommentWithCountAndUserInteraction[]> {
    let queryIncludes: boolean | PostCommentInclude<DefaultArgs> | undefined = {
      _count: {
        select: {
          childComments: true,
          reactions: {
            where: {
              reactionType: ReactionType.LIKE,
            },
          },
        },
      },
      user: true,
    }

    if (userId !== null) {
      queryIncludes = {
        ...queryIncludes,
        reactions: {
          where: {
            AND: [
              {
                userId,
              },
              {
                reactionType: ReactionType.LIKE,
              },
            ],
          },
        },
      }
    }

    const comments = await prisma.postComment.findMany({
      where: { postId },
      take: limit,
      skip: offset,
      include: queryIncludes,
      orderBy: { createdAt: 'desc' },
    })

    return comments.map((postComment): PostCommentWithCountAndUserInteraction => {
      let userReaction: Reaction | null = null

      if (userId !== null && postComment.reactions.length > 0) {
        userReaction = ReactionModelTranslator.toDomain(postComment.reactions[0])
      }

      return {
        postComment: PostCommentModelTranslator.toDomain(postComment, ['comments.user']),
        childComments: postComment._count.childComments,
        reactions: postComment._count.reactions,
        userReaction,
      }
    })
  }

  /**
   * Find Child Comments based on its postId (includes user model and childComments count and reactions (like) count)
   * @param parentCommentId Parent comment ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @return Array of PostChildCommentWithReactionCount
   */
  public async findChildWithOffsetAndLimit (
    parentCommentId: PostChildComment['id'],
    offset: number,
    limit: number,
    userId: PostChildComment['userId'] | null
  ): Promise<PostChildCommentWithReactionCountAndUserInteraction[]> {
    let queryIncludes: boolean | PostCommentInclude<DefaultArgs> | undefined = {
      _count: {
        select: {
          childComments: true,
          reactions: {
            where: {
              reactionType: ReactionType.LIKE,
            },
          },
        },
      },
      user: true,
    }

    if (userId !== null) {
      queryIncludes = {
        ...queryIncludes,
        reactions: {
          where: {
            AND: [
              {
                userId,
              },
              {
                reactionType: ReactionType.LIKE,
              },
            ],
          },
        },
      }
    }

    const childComments = await prisma.postComment.findMany({
      where: { parentCommentId },
      take: limit,
      skip: offset,
      include: queryIncludes,
      orderBy: { createdAt: 'desc' },
    })

    return childComments.map((childComment): PostChildCommentWithReactionCountAndUserInteraction => {
      let userReaction: Reaction | null = null

      if (userId !== null && childComment.reactions.length > 0) {
        userReaction = ReactionModelTranslator.toDomain(childComment.reactions[0])
      }

      return {
        postChildComment: PostChildCommentModelTranslator.toDomain(childComment, ['comments.user']),
        reactions: childComment._count.reactions,
        userReaction,
      }
    })
  }

  /**
   * Count Comments from a Post
   * @param postId Post ID
   * @return Post's comments number
   */
  public async countPostComments (
    postId: Post['id']
  ): Promise<number> {
    const commentsNumber = await prisma.postComment.count({
      where: { postId },
    })

    return commentsNumber
  }

  /**
   * Count Child Comments from a Post
   * @param postId Post ID
   * @param parentCommentId Parent comment ID
   * @return Child Post's comments number
   */
  public async countPostChildComments (
    parentCommentId: PostChildComment['parentCommentId']
  ): Promise<number> {
    const childCommentsNumber = await prisma.postComment.count({
      where: { parentCommentId },
    })

    return childCommentsNumber
  }

  /**
   * Find a PostComment/PostChildComment by its ID
   * @param postCommentId Comment ID
   * @param parentCommentId Parent comment ID
   * @return PostComment or PostChildComment
   */
  public async findById (
    postCommentId: PostComment['id'] | PostChildComment['id'],
    parentCommentId: PostChildComment['parentCommentId'] | null
  ): Promise<PostComment | PostChildComment | null> {
    const postComment = await prisma.postComment.findFirst({
      where: {
        AND: [
          { id: postCommentId },
          { parentCommentId },
        ],
      },
      include: {
        reactions: true,
      },
    })

    if (postComment === null) {
      return null
    }

    if (parentCommentId === null) {
      return PostCommentModelTranslator.toDomain(postComment, ['comments.reactions'])
    }

    return PostChildCommentModelTranslator.toDomain(postComment, ['comments.reactions'])
  }
}
