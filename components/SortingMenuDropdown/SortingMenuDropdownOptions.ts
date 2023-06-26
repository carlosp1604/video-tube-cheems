import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'

export interface SortingOption {
  translationKey: string
  option: InfrastructureSortingOptions
  criteria: InfrastructureSortingCriteria
}

export const defaultSortingOption: SortingOption = {
  translationKey: 'latest_entries_option',
  option: InfrastructureSortingOptions.DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const sortingOptions: SortingOption[] = [
  defaultSortingOption,
  {
    translationKey: 'oldest_entries_option',
    option: InfrastructureSortingOptions.DATE,
    criteria: InfrastructureSortingCriteria.ASC,
  },
  {
    translationKey: 'most_viewed_entries_option',
    option: InfrastructureSortingOptions.VIEWS,
    criteria: InfrastructureSortingCriteria.DESC,
  },
]
