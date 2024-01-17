import { Actor } from './Actor'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ActorsWithPostsCountWithTotalCount } from '~/modules/Actors/Domain/ActorWithCountInterface'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'

export interface ActorRepositoryInterface {
  /**
   * Find an Actor given its ID
   * @param actorId Actor ID
   * @return Actor if found or null
   */
  findById(actorId: Actor['id']): Promise<Actor | null>

  /**
   * Find an Actor given its slug
   * @param actorSlug Actor Slug
   * @return Actor if found or null
   */
  findBySlug (actorSlug: Actor['slug']): Promise<Actor | null>

  /**
   * Find Actors based on sorting criteria
   * @param offset Actor offset
   * @param limit
   * @param sortingOption Actor sorting option
   * @param sortingCriteria Sorting criteria
   * @return ActorsWithPostsCountWithTotalCount
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria,
  ): Promise<ActorsWithPostsCountWithTotalCount>
}
