import { Post } from './Post'
import { PostChildComment } from './PostChildComment'
import { PostComment } from './PostComment'
import { PostReaction } from './PostReaction'
import { PostWithCountInterface } from './PostWithCountInterface'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'
import {
  RepositoryFilterOptionInterface
} from '~/modules/Shared/Domain/RepositoryFilterOption'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { User } from '~/modules/Auth/Domain/User'

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

export type PostRepositoryFilterOption = RepositoryFilterOptionInterface

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
   * Find a Post (with producer,tags,meta,actors relationships loaded and reactions/comments count) given its Slug
   * @param slug Post Slug
   * @return PostWithCount if found or null
   */
  findBySlugWithCount(slug: Post['slug']): Promise<PostWithCountInterface | null>

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
   * Add a new Post Child Comment
   * @param comment Post Child Comment
   */
  createChildComment(childComment: PostChildComment): Promise<void>

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
    filters: PostRepositoryFilterOption[],
  ): Promise<PostWithCountInterface[]>

  /**
   * Count Posts based on filters
   * @param filters Post filters
   * @return Number of posts that accomplish with the filters
   */
  countPostsWithFilters(
    filters: PostRepositoryFilterOption[],
  ): Promise<number>

  /**
   * Get posts related to another post given its ID
   * @param postId Post ID
   * @return Post array with the related posts
   */
  getRelatedPosts(postId: Post['id']): Promise<PostWithCountInterface[]>

  /**
   * Create a new post view for a post given its ID
   * @param postId Post ID
   * @param postView Post View
   */
  createPostView (postId: Post['id'], postView: PostView): Promise<void>

  /**
   * Find a user reaction for a post given its IDs
   * @param postId Post ID
   * @param userId User ID
   * @return Post Reaction if found or null
   */
  findUserReaction (postId: Post['id'], userId: User['id']): Promise<PostReaction | null>
}
