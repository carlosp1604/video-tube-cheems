import { Post } from './Post'

export type RepositoryOptions = 'meta' | 'tags' | 'actors'
export type RepositoryOrderCriteria = 'date_asc' | 'date_desc' | 'views_asc' | 'views_desc'
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
   * @return Post if found or null
   */
  findById(postId: Post['id']): Promise<Post | null>

  /**
   * Find Posts based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param order Post sorting criteria
   * @param filter Post filter
   * @return Post if found or null
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    order: RepositoryOrderCriteria,
    filter?: RepositoryFilter
  ): Promise<Post[]>
}