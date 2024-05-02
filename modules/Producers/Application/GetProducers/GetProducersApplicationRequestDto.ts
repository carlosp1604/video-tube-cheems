export interface GetProducersRequestFilterDto {
  type: string
  value: string
}

export interface GetProducersApplicationRequestDto {
  filters: GetProducersRequestFilterDto[]
  sortOption: string
  sortCriteria: string
  page: number
  producersPerPage: number
}
