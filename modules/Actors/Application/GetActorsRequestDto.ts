import { SortingApplicationCriteria, SortingApplicationOptions } from '../../Shared/Application/ApplicationSorting'
import { ApplicationFilter, FilterApplicationOption } from '../../Shared/Application/FilterApplicationOption'

export type GetActorsFilterOptions = Extract<FilterApplicationOption,
 'actorName' |
 'actorId'
>

export interface GetActorsRequestDto {
  filters: ApplicationFilter<GetActorsFilterOptions>[]
  sortOption: SortingApplicationOptions
  sortCriteria: SortingApplicationCriteria
  page: number
  actorsPerPage: number
}