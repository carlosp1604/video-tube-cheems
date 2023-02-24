import { InfrastructureFilter } from '../../Shared/Infrastructure/InfrastructureFilter'
import {
  SortingInfrastructureCriteriaType, 
  SortingInfrastructureOptionsType 
} from '../../Shared/Infrastructure/InfrastructureSorting'
import { ActorFilterOptionsType } from './ActorFilter'

export interface GetActorsApiRequestDto {
  readonly page: number,
  readonly actorsPerPage: number,
  readonly filters: InfrastructureFilter<ActorFilterOptionsType>[],
  readonly sortOption: SortingInfrastructureOptionsType
  readonly sortCriteria: SortingInfrastructureCriteriaType
}