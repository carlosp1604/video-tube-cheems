export interface GetActorsRequestFilterDto {
  type: string
  value: string
}

export interface GetActorsApplicationRequestDto {
  filters: GetActorsRequestFilterDto[]
  sortOption: string
  sortCriteria: string
  page: number
  actorsPerPage: number
}
