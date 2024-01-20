import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'

export interface ComponentSortingOption {
  translationKey: string
  option: InfrastructureSortingOptions
  criteria: InfrastructureSortingCriteria
}
