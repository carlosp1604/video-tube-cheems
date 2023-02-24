export enum SortingInfrastructureOptions {
  'date' = 'date',
  'views' = 'views'
}

export type SortingInfrastructureOptionsType = keyof typeof SortingInfrastructureOptions
  
export enum SortingInfrastructureCriteria {
  'asc' = 'asc',
  'desc' = 'desc'
} 

export type SortingInfrastructureCriteriaType = keyof typeof SortingInfrastructureCriteria
  