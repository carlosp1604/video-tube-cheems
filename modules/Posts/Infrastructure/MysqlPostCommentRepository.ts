import { prisma } from '../../../persistence/prisma'
import { Post } from '../Domain/Post'
import { PostComment } from '../Domain/PostComment'
import { PostCommentRepositoryInterface } from '../Domain/PostCommentRepositoryInterface'
import { PostCommentWithCount } from '../Domain/PostCommentWithCountInterface'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'

export class MysqlPostCommentRepository implements PostCommentRepositoryInterface {
  /**
   * Find Comments based on its postId (includes user model and childComments count)
   * @param postId Post ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @param parentCommentId Parent comment ID or null
   * @return Array of PostCommentWithCount
   */
  public async findWithOffsetAndLimit(
      postId: Post['id'],
      offset: number,
      limit: number,
      parentCommentId: PostComment['parentCommentId']
    ): Promise<PostCommentWithCount[]> {
      const comments = await prisma.postComment.findMany({
        where: {
          postId : postId,
          parentCommentId: parentCommentId
        },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              childComments: true
            }
          },
          user: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return comments.map((post): PostCommentWithCount => {
        return {
          postComment: PostCommentModelTranslator.toDomain(post, ['comments.user']),
          childComments: post._count.childComments
        }
      })
    }
  
    /**
     * Count Comments from a Post
     * @param postId Post ID
     * @return Post's comments number
     */
    public async countPostsWithFilters(
      postId: Post['id'],
      parentCommentId: PostComment['parentCommentId']
    ): Promise<number> {
      const commentsNumber = await prisma.postComment.count({
        where: {
          postId : postId,
          parentCommentId: parentCommentId
        }
      })

      return commentsNumber
    }
}