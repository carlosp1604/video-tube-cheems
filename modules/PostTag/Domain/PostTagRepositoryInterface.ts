import { PostTag } from '~/modules/PostTag/Domain/PostTag'

export interface PostTagRepositoryInterface {
  /**
   * Insert a Tag in the persistence layer
   * @param tag Tag to persist
   */
  save (tag: PostTag): Promise<void>

  /**
   * Find a Tag given its slug
   * @param tagSlug Tag Slug
   * @return Tag if found or null
   */
  findBySlug (tagSlug: PostTag['slug']): Promise<PostTag | null>
}
