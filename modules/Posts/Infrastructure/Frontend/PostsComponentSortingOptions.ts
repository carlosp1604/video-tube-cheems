import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { ComponentSortingOption } from '~/components/SortingMenuDropdown/ComponentSortingOptions'

export const NewestPostsSortingOption: ComponentSortingOption = {
  translationKey: 'latest_entries_option',
  option: InfrastructureSortingOptions.DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const OldestPostsSortingOption: ComponentSortingOption = {
  translationKey: 'oldest_entries_option',
  option: InfrastructureSortingOptions.DATE,
  criteria: InfrastructureSortingCriteria.ASC,
}

export const MoreViewsPostsSortingOption: ComponentSortingOption = {
  translationKey: 'most_viewed_entries_option',
  option: InfrastructureSortingOptions.VIEWS,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const PopularitySortingOption: ComponentSortingOption = {
  translationKey: 'popularity_entries_option',
  option: InfrastructureSortingOptions.VIEWS,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const NewestSavedPostsSortingOption: ComponentSortingOption = {
  translationKey: 'newest_saved_posts_option',
  option: InfrastructureSortingOptions.SAVED_DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const OldestSavedPostsSortingOption: ComponentSortingOption = {
  translationKey: 'oldest_saved_posts_option',
  option: InfrastructureSortingOptions.SAVED_DATE,
  criteria: InfrastructureSortingCriteria.ASC,
}

export const NewestViewedSortingOption: ComponentSortingOption = {
  translationKey: 'newest_viewed_posts_option',
  option: InfrastructureSortingOptions.VIEW_DATE,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const OldestViewedSortingOption: ComponentSortingOption = {
  translationKey: 'oldest_viewed_posts_option',
  option: InfrastructureSortingOptions.VIEW_DATE,
  criteria: InfrastructureSortingCriteria.ASC,
}
