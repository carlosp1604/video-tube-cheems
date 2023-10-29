import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'

export interface SortingOption {
  translationKey: string
  option: InfrastructureSortingOptions
  criteria: InfrastructureSortingCriteria
}

export const HomePostsDefaultSortingOption: SortingOption = {
  translationKey: 'latest_entries_option',
  option: InfrastructureSortingOptions.DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const SavedPostsDefaultSortingOption: SortingOption = {
  translationKey: 'newest_saved_posts_options',
  option: InfrastructureSortingOptions.SAVED_DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const HomePostsSortingOptions: SortingOption[] = [
  HomePostsDefaultSortingOption,
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

export const SavePostsSortingOptions: SortingOption[] = [
  SavedPostsDefaultSortingOption,
  {
    translationKey: 'oldest_saved_posts_option',
    option: InfrastructureSortingOptions.SAVED_DATE,
    criteria: InfrastructureSortingCriteria.ASC,
  },
]
