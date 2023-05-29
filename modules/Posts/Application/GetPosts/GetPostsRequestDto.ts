export interface GetPostRequestFilterDto {
  type: string
  value: string
}

export interface GetPostsRequestDto {
  filters: GetPostRequestFilterDto[]
  sortOption: string
  sortCriteria: string
  page: number
  postsPerPage: number
}
