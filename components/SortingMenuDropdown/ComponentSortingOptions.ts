import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'

export interface ComponentSortingOption {
  translationKey: string
  option: InfrastructureSortingOptions
  criteria: InfrastructureSortingCriteria
}

export const HomePostsDefaultSortingOption: ComponentSortingOption = {
  translationKey: 'latest_entries_option',
  option: InfrastructureSortingOptions.DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const HomeOldestEntriesSortingOption: ComponentSortingOption = {
  translationKey: 'oldest_entries_option',
  option: InfrastructureSortingOptions.DATE,
  criteria: InfrastructureSortingCriteria.ASC,
}

export const HomeMoreViewsEntriesSortingOption: ComponentSortingOption = {
  translationKey: 'most_viewed_entries_option',
  option: InfrastructureSortingOptions.VIEWS,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const HomePostsSortingOptions: ComponentSortingOption[] = [
  HomePostsDefaultSortingOption,
  HomeOldestEntriesSortingOption,
  HomeMoreViewsEntriesSortingOption,
]

export const SavedPostsDefaultSortingOption: ComponentSortingOption = {
  translationKey: 'newest_saved_posts_options',
  option: InfrastructureSortingOptions.SAVED_DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const SavedPostsOldestSavedSortingOption: ComponentSortingOption = {
  translationKey: 'oldest_saved_posts_option',
  option: InfrastructureSortingOptions.SAVED_DATE,
  criteria: InfrastructureSortingCriteria.ASC,
}

export const SavePostsSortingOptions: ComponentSortingOption[] = [
  SavedPostsDefaultSortingOption,
  SavedPostsOldestSavedSortingOption,
]

export const HistoryDefaultSortingOption: ComponentSortingOption = {
  translationKey: 'newest_saved_posts_options',
  option: InfrastructureSortingOptions.VIEW_DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const HistoryOldestViewedSortingOption: ComponentSortingOption = {
  translationKey: 'newest_saved_posts_options',
  option: InfrastructureSortingOptions.VIEW_DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const HistorySortingOptions: ComponentSortingOption[] = [
  HistoryDefaultSortingOption,
  HistoryOldestViewedSortingOption,
]
