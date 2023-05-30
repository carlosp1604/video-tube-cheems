import { RepositoryFilterOption, RepositoryFilterOption } from '../../Shared/Domain/RepositoryFilterOption'
import { RepositorySortingCriteria, RepositorySortingOptions } from '../../Shared/Domain/RepositorySorting'
import { Actor } from './Actor'

export type ActorRepositoryFilterOption = Extract<RepositoryFilterOption,
  'actorName' |
  'actorId'
>

export interface ActorRepositoryInterface {
  /**
   * Find an Actor given its ID
   * @param actorId Actor ID
   * @return Actor if found or null
   */
  findById(actorId: Actor['id']): Promise<Actor | null>

  /**
   * Find Actors based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @return Post if found or null
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filters: RepositoryFilterOption<ActorRepositoryFilterOption>[],
  ): Promise<Actor[]>

  /**
   * Count Actos based on filters
   * @param filters Actor filters
   * @return Number of actors that accomplish with the filters
   */
  countPostsWithFilters(
    filters: RepositoryFilterOption<ActorRepositoryFilterOption>[],
  ): Promise<number>
}
