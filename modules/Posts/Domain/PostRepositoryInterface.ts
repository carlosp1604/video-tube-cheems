import { Post } from './Post'
import { PostComment } from './PostComment'
import { PostReaction } from './PostReaction'

export type RepositoryOptions =
  'meta' | 'tags' | 'actors' | 'comments' | 'reactions' | 'comments.user' |
  'comments.childComments' | 'comments.childComments.user'

export type RepositorySortingOptions = 'date' | 'views'
export type RepositorySortingCriteria = 'asc' | 'desc'
export type RepositoryFilter = { type: 'title', value: string }
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
   * Add a new Post Reaction
   * @param reaction PostReaction
   */
  createReaction(reaction: PostReaction): Promise<void>

  /**
   * Update a new Post Reaction
   * @param reaction PostReaction
   */
  updateReaction(reaction: PostReaction): Promise<void>

  /**
   * Delete a new Post Reaction
   * @param reaction PostReaction
   */
  deleteReaction(reaction: PostReaction): Promise<void>

  /**
   * Add a new Post Comment
   * @param comment PostComment
   */
  createComment(comment: PostComment): Promise<void>

  /**
   * Update a Post Comment
   * @param comment PostComment
   */
  updateComment(comment: PostComment): Promise<void>

  /**
   * Delete a Post Comment
   * @param comment PostComment
   */
  deleteComment(comment: PostComment): Promise<void>

  /**
   * Find Posts based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filter Post filter
   * @return Post if found or null
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filter?: RepositoryFilter,
  ): Promise<Post[]>
}