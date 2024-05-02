import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export const AvailablePostFilters:
  Extract<FilterOptions,
    FilterOptions.POST_TITLE |
    FilterOptions.SEARCH |
    FilterOptions.PRODUCER_SLUG |
    FilterOptions.ACTOR_SLUG |
    FilterOptions.TAG_SLUG |
    FilterOptions.SAVED_BY |
    FilterOptions.VIEWED_BY
  >[] = [
    FilterOptions.POST_TITLE,
    FilterOptions.SEARCH,
    FilterOptions.PRODUCER_SLUG,
    FilterOptions.ACTOR_SLUG,
    FilterOptions.TAG_SLUG,
    FilterOptions.SAVED_BY,
    FilterOptions.VIEWED_BY,
  ]

export type PostFilterOptions = typeof AvailablePostFilters[number]
