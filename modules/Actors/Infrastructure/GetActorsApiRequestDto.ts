import { ActorFilterOptionsType } from './ActorFilter'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'

export interface GetActorsApiRequestDto {
  readonly page: number
  readonly actorsPerPage: number
  readonly filters: ActorFilterOptionsType
  readonly sortOption: InfrastructureSortingOptions
  readonly sortCriteria: InfrastructureSortingCriteria
}
