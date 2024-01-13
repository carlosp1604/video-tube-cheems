import { Producer } from './Producer'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'

export interface ProducerRepositoryInterface {
  get(repositoryOptions: RepositoryOptions[]): Promise<Producer[]>

  /**
   * Find a Producer given its slug
   * @param producerSlug Producer Slug
   * @return Producer if found or null
   */
  findBySlug (producerSlug: Producer['slug']): Promise<Producer | null>
}
