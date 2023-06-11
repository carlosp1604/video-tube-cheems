import { PostChildCommentModelTranslator } from './ModelTranslators/PostChildCommentModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostCommentWithCount } from '~/modules/Posts/Domain/PostCommentWithCountInterface'
import { prisma } from '~/persistence/prisma'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'

export class MysqlPostCommentRepository implements PostCommentRepositoryInterface {
  /**
   * Find Comments based on its postId (includes user model and childComments count)
   * @param postId Post ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @return Array of PostCommentWithCount
   */
  public async findWithOffsetAndLimit (
    postId: Post['id'],
    offset: number,
    limit: number
  ): Promise<PostCommentWithCount[]> {
    const comments = await prisma.postComment.findMany({
      where: { postId },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: {
            childComments: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return comments.map((post): PostCommentWithCount => {
      return {
        postComment: PostCommentModelTranslator.toDomain(post, ['comments.user']),
        childComments: post._count.childComments,
      }
    })
  }

  /**
   * Find Child Comments based on its postId (includes user model and childComments count)
   * @param parentCommentId Parent comment ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @return Array of PostCommentWithCount
   */
  public async findChildsWithOffsetAndLimit (
    parentCommentId: PostChildComment['id'],
    offset: number,
    limit: number
  ): Promise<PostChildComment[]> {
    const childComments = await prisma.postComment.findMany({
      where: { parentCommentId },
      take: limit,
      skip: offset,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })

    return childComments.map((childComment): PostChildComment => {
      return PostChildCommentModelTranslator.toDomain(childComment, ['comments.user'])
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
}
