import { Post } from '@prisma/client'
import { RepositoryFilterOption } from '../../Shared/Domain/RepositoryFilter'
import { PostChildComment } from './PostChildComment'
import { PostCommentWithCount } from './PostCommentWithCountInterface'

export type PostRepositoryFilterOption = RepositoryFilterOption

export interface PostCommentRepositoryInterface {

  /**
   * Find Comments based on its postId (includes user model and childComments count)
   * @param postId Post ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @return Array of PostCommentWithCount
   */
  findWithOffsetAndLimit(
    postId: Post['id'],
    offset: number,
    limit: number,
  ): Promise<PostCommentWithCount[]>

  /**
   * Find Child Comments based on its postId (includes user model and childComments count)
   * @param parentCommentId Parent comment ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @return Array of PostCommentWithCount
   */
  findChildsWithOffsetAndLimit(
    parentCommentId: PostChildComment['id'],
    offset: number,
    limit: number,
  ): Promise<PostChildComment[]>

  /**
   * Count Comments from a Post
   * @param postId Post ID
   * @return Post's comments number
   */
  countPostComments(
    postId: Post['id'],
  ): Promise<number>

  /**
   * Count Child Comments from a Post
   * @param postId Post ID
   * @param parentCommentId Parent comment ID
   * @return Child Post's comments number
   */
  countPostChildComments(
    parentCommentId: PostChildComment['parentCommentId']
  ): Promise<number>
}