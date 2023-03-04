import { Post } from '@prisma/client'
import { RepositoryFilterOption } from '../../Shared/Domain/RepositoryFilter'
import { PostComment } from './PostComment'
import { PostCommentWithCount } from './PostCommentWithCountInterface'

export type PostRepositoryFilterOption = RepositoryFilterOption

export interface PostCommentRepositoryInterface {

  /**
   * Find Comments based on its postId (includes user model and childComments count)
   * @param postId Post ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @param parentCommentId Parent comment ID or null
   * @return Array of PostCommentWithCount
   */
  findWithOffsetAndLimit(
    postId: Post['id'],
    offset: number,
    limit: number,
    parentCommentId: PostComment['parentCommentId']
  ): Promise<PostCommentWithCount[]>

  /**
   * Count Comments from a Post
   * @param postId Post ID
   * @param parentCommentId Parent comment ID or null
   * @return Post's comments number
   */
  countPostsWithFilters(
    postId: Post['id'],
    parentCommentId: PostComment['parentCommentId']
  ): Promise<number>
}