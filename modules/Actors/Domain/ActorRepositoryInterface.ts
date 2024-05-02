import { Actor } from './Actor'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ActorsWithPostsCountViewsCountWithTotalCount } from '~/modules/Actors/Domain/ActorWithCountInterface'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'
import { ActorFilterOptionInterface } from '~/modules/Actors/Domain/ActorFilterOption'

export interface ActorRepositoryInterface {
  /**
   * Insert an Actor in the persistence layer
   * @param actor Actor to persist
   */
  save (actor: Actor): Promise<void>

  /**
   * Count actors number
   * @return number of actors
   */
  count (): Promise<number>

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
   * @param offset Records offset
   * @param limit Records limit
   * @param sortingOption Sorting option
   * @param sortingCriteria Sorting criteria
   * @param filters Actor filters
   * @return ActorsWithPostsCountViewsCountWithTotalCount
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria,
    filters: ActorFilterOptionInterface[]
  ): Promise<ActorsWithPostsCountViewsCountWithTotalCount>

  /**
   * Add a new actor view for an actor given its ID
   * @param actorId Actor ID
   */
  addActorView (actorId: Actor['id']): Promise<void>
}
