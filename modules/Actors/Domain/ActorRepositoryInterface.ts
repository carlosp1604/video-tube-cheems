import { Actor } from './Actor'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'

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
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
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
