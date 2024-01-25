import { Producer } from './Producer'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ProducersWithPostsCountWithTotalCount } from '~/modules/Producers/Domain/ProducerWithCountInterface'

export interface ProducerRepositoryInterface {
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
   * @return ProducersWithPostsCountWithTotalCount
   */
  findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria
  ): Promise<ProducersWithPostsCountWithTotalCount>
}
