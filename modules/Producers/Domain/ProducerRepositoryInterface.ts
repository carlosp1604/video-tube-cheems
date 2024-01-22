import { Producer } from './Producer'

export interface ProducerRepositoryInterface {
  get(): Promise<Producer[]>

  /**
   * Find a Producer given its slug
   * @param producerSlug Producer Slug
   * @return Producer if found or null
   */
  findBySlug (producerSlug: Producer['slug']): Promise<Producer | null>
}
