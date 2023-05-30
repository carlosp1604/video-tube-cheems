export interface GetActorsRequestFilterDto {
  type: string
  value: string
}

export interface GetActorsRequestDto {
  filters: GetActorsRequestFilterDto[]
  sortOption: string
  sortCriteria: string
  page: number
  actorsPerPage: number
}
