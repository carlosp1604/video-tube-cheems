import { Post } from './Post'
import { PostChildComment } from './PostComments/PostChildComment'
import { PostComment } from './PostComments/PostComment'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import {
  PostSortingOption
} from '~/modules/Shared/Domain/Posts/PostSorting'
import {
  PostFilterOptionInterface
} from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { User } from '~/modules/Auth/Domain/User'
import {
  PostsWithViewsInterfaceWithTotalCount,
  PostWithViewsCommentsReactionsInterface,
  PostWithViewsInterface
} from '~/modules/Posts/Domain/PostWithCountInterface'
import { PostUserInteraction } from '~/modules/Posts/Domain/PostUserInteraction'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { View } from '~/modules/Views/Domain/View'

export type RepositoryOptions =
  'meta' |
  'tags' |
  'actor' |
  'actors' |
  'producer' |
  'comments' |
  'postMedia' |
  'reactions' |
  'viewsCount' |
  'translations' |
  'comments.user' |
  'reactions.user' |
  'comments.reactions' |
  'comments.childComments' |
  'producer.parentProducer' |
  'comments.childComments.user'

export interface PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  save(post: Post): Promise<void>

  /**
   * Specific use-case for post media update
   * Get a post given its slug with its post media
   * @param slug Post Slug
   * @return Post if found or null
   */
  getPostBySlugWithPostMedia(slug: Post['slug']): Promise<Post | null>

  /**
   * Specific use-case for post media update
   * Update post media
   * v1: Work in replace mode
   * @param post Post
   */
  updatePostBySlugWithPostMedia(post: Post): Promise<void>

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  findById(postId: Post['id'], options?: RepositoryOptions[]): Promise<Post | PostWithViewsInterface | null>

  /**
   * Find a Post (with producer,tags,meta,actors relationships loaded and reactions/comments count) given its Slug
   * @param slug Post Slug
   * @return PostWithCount if found or null
   */
  findBySlugWithCount(slug: Post['slug']): Promise<PostWithViewsCommentsReactionsInterface | null>

  /**
   * Add a new Post Reaction
   * @param reaction Post Reaction
   */
  createReaction(reaction: Reaction): Promise<void>

  /**
   * Update a new Post Reaction
   * @param reaction Post Reaction
   */
  updateReaction(reaction: Reaction): Promise<void>

  /**
   * Delete a new Post Reaction
   * @param userId User ID
   * @param postId Post ID
   */
  deleteReaction(userId: Reaction['userId'], postId: Reaction['reactionableId']): Promise<void>

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
   * @return PostsWithViewsInterfaceWithTotalCount
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[],
  ): Promise<PostsWithViewsInterfaceWithTotalCount>

  /**
   * Find SavedPosts based on filter and order criteria
   * @param userId User ID
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filters Post filters
   * @return PostsWithViewsInterfaceWithTotalCount if found or null
   */
  findSavedPostsWithOffsetAndLimit (
    userId: string,
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostsWithViewsInterfaceWithTotalCount>

  /**
   * Find ViewedPosts based on filter and order criteria
   * @param userId User ID
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filters Post filters
   * @return PostsWithViewsInterfaceWithTotalCount if found or null
   */
  findViewedPostsWithOffsetAndLimit (
    userId: string,
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostsWithViewsInterfaceWithTotalCount>

  /**
   * Count Posts based on filters
   * @param filters Post filters
   * @return Number of posts that accomplish with the filters
   */
  countPostsWithFilters(
    filters: PostFilterOptionInterface[],
  ): Promise<number>

  /**
   * Get posts related to another post given its ID
   * @param postId Post ID
   * @return Post array with the related posts
   */
  getRelatedPosts(postId: Post['id']): Promise<PostWithViewsInterface[]>

  /**
   * Get posts published on the specified date
   * @param date Date
   * @return Post array with the posts
   */
  getPostsPublishedOnDate(date: Date): Promise<Post[]>

  /**
   * Get top (most viewed) posts between 2 given dates
   * @param startDate Start Date
   * @param endDate End Date
   * @return Post array with the posts
   */
  getTopPostsBetweenDates(startDate: Date, endDate: Date): Promise<PostWithViewsInterface[]>

  /**
   * Create a new post view for a post given its ID
   * @param postId Post ID
   * @param view Post View
   */
  createPostView (postId: Post['id'], view: View | null): Promise<void>

  /**
   * Find all user interaction with a post given its IDs
   * @param postId Post ID
   * @param userId User ID
   * @return PostUserInteraction
   */
  findUserInteraction (postId: Post['id'], userId: User['id']): Promise<PostUserInteraction>
}
