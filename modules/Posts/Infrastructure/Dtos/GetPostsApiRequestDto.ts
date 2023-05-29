export interface GetPostsApiFilterRequestDto {
  type: string
  value: string
}

export interface GetPostsApiRequestDto {
  readonly page: number
  readonly postsPerPage: number
  readonly filters: GetPostsApiFilterRequestDto[]
  readonly sortOption: string
  readonly sortCriteria: string
}
