import { SortingApplicationCriteria, SortingApplicationOptions } from '../../../Shared/Application/ApplicationSorting'
import { ApplicationFilter, FilterApplicationOption } from '../../../Shared/Application/FilterApplicationOption'

export type GetPostsFilterOptions = FilterApplicationOption

export interface GetPostsRequestDto {
  filters: ApplicationFilter<GetPostsFilterOptions>[]
  sortOption: SortingApplicationOptions
  sortCriteria: SortingApplicationCriteria
  page: number
  postsPerPage: number
}