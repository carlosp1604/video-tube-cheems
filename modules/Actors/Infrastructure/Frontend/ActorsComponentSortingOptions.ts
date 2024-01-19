import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { ComponentSortingOption } from '~/components/SortingMenuDropdown/ComponentSortingOptions'

export const NameFirstActorsSortingOption: ComponentSortingOption = {
  translationKey: 'name_first_entries_option',
  option: InfrastructureSortingOptions.NAME,
  criteria: InfrastructureSortingCriteria.ASC,
}

export const NameLastActorsSortingOption: ComponentSortingOption = {
  translationKey: 'name_last_entries_option',
  option: InfrastructureSortingOptions.NAME,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const MorePostsActorsSortingOption: ComponentSortingOption = {
  translationKey: 'more_posts_entries_option',
  option: InfrastructureSortingOptions.POSTS_NUMBER,
  criteria: InfrastructureSortingCriteria.DESC,
}

export const LessPostsActorsSortingOption: ComponentSortingOption = {
  translationKey: 'less_posts_entries_option',
  option: InfrastructureSortingOptions.POSTS_NUMBER,
  criteria: InfrastructureSortingCriteria.ASC,
}
