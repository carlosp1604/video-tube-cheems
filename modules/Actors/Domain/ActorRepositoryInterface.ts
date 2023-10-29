import { Actor } from './Actor'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/Posts/PostSorting'

export type ActorRepositoryFilterOption = Extract<PostFilterOptionInterface,
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
    filters: PostFilterOptionInterface[],
  ): Promise<Actor[]>

  /**
   * Count Actos based on filters
   * @param filters Actor filters
   * @return Number of actors that accomplish with the filters
   */
  countPostsWithFilters(
    filters: PostFilterOptionInterface[],
  ): Promise<number>
}
