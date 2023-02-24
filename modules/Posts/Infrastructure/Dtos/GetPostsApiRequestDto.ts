import { InfrastructureFilter } from '../../../Shared/Infrastructure/InfrastructureFilter'
import { SortingInfrastructureCriteriaType, SortingInfrastructureOptionsType } from '../../../Shared/Infrastructure/InfrastructureSorting'
import { PostFilterOptionsType } from '../PostFilters'

export interface GetPostsApiRequestDto {
  readonly page: number,
  readonly postsPerPage: number,
  readonly filters: InfrastructureFilter<PostFilterOptionsType>[],
  readonly sortOption: SortingInfrastructureOptionsType
  readonly sortCriteria: SortingInfrastructureCriteriaType
}