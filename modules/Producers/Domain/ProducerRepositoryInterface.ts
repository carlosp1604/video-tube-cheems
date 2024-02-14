import { Producer } from './Producer'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ProducersWithPostsCountViewsCountWithTotalCount } from '~/modules/Producers/Domain/ProducerWithCountInterface'
import { View } from '~/modules/Views/Domain/View'

export interface ProducerRepositoryInterface {
  /**
   * Insert a Producer in the persistence layer
   * @param producer Producer to persist
   */
  save(producer: Producer): Promise<void>

  get(): Promise<Producer[]>

  /**
   * Find a Producer given its slug
   * @param producerSlug Producer Slug
   * @return Producer if found or null
   */
  findBySlug (producerSlug: Producer['slug']): Promise<Producer | null>

  /**
   * Find Producers based on sorting criteria
   * @param offset Records offset
   * @param limit Records limit
   * @param sortingOption Sorting option
   * @param sortingCriteria Sorting criteria
   * @return ProducersWithPostsCountViewsCountWithTotalCount
   */
  findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria
  ): Promise<ProducersWithPostsCountViewsCountWithTotalCount>

  /**
   * Create a new producer view for a producer given its ID
   * @param producerId Producer ID
   * @param view Producer View
   */
  createProducerView (producerId: Producer['id'], view: View): Promise<void>
}
