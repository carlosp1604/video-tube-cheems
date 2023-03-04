import { RepositoryFilter, RepositoryFilterOption } from '../../Shared/Domain/RepositoryFilter'
import { RepositorySortingCriteria, RepositorySortingOptions } from '../../Shared/Domain/RepositorySorting'
import { Post } from './Post'
import { PostComment } from './PostComment'
import { PostReaction } from './PostReaction'
import { PostWithCountInterface } from './PostWithCountInterface'

export type RepositoryOptions =
  'meta' | 
  'tags' | 
  'actors' |
  'producer' |
  'comments' |
  'reactions' |
  'comments.user' |
  'reactions.user' |
  'comments.childComments' |
  'producer.parentProducer' |
  'comments.childComments.user'

export type PostRepositoryFilterOption = RepositoryFilterOption

export interface PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  save(post: Post): Promise<void>

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  findById(postId: Post['id'], options?: RepositoryOptions[]): Promise<Post | null>

  /**
   * Find a Post (with producer,tags,meta,actors relationships loaded and reactions/comments count) given its ID
   * @param postId Post ID
   * @return PostWithCount if found or null
   */
  findByIdWithCount(postId: Post['id']): Promise<PostWithCountInterface | null>

  /**
   * Add a new Post Reaction
   * @param reaction Post Reaction
   */
  createReaction(reaction: PostReaction): Promise<void>

  /**
   * Update a new Post Reaction
   * @param reaction Post Reaction
   */
  updateReaction(reaction: PostReaction): Promise<void>

  /**
   * Delete a new Post Reaction
   * @param userId User ID
   * @param postId Post ID
   */
  deleteReaction(userId: PostReaction['userId'], postId: PostReaction['postId']): Promise<void>

  /**
   * Add a new Post Comment
   * @param comment Post Comment
   */
  createComment(comment: PostComment): Promise<void>

  /**
   * Update a Post Comment
   * @param commentId Post Comment ID 
   * @param comment Post Comment comment
   */
  updateComment(commentId: PostComment['id'], comment: PostComment['comment']): Promise<void>

  /**
   * Delete a Post Comment
   * @param commentId Post Comment ID 
   */
  deleteComment(commentId: PostComment['id']): Promise<void>

  /**
   * Find Posts based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filters Post filters
   * @return PostWithCount if found or null
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filters: RepositoryFilter<PostRepositoryFilterOption>[],
  ): Promise<PostWithCountInterface[]>

  /**
   * Count Posts based on filters
   * @param filters Post filters
   * @return Number of posts that accomplish with the filters
   */
  countPostsWithFilters(
    filters: RepositoryFilter<PostRepositoryFilterOption>[],
  ): Promise<number>
}