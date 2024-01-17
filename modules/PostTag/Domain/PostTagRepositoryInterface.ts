import { PostTag } from '~/modules/PostTag/Domain/PostTag'

export interface PostTagRepositoryInterface {

  /**
   * Find a Tag given its slug
   * @param tagSlug Tag Slug
   * @return Tag if found or null
   */
  findBySlug (tagSlug: PostTag['slug']): Promise<PostTag | null>
}
