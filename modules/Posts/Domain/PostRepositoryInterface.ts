import { Post } from './Post'

export type RepositoryOptions = 'meta' | 'tags' | 'actors'

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
}