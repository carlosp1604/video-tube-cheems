export interface GetPostsApiFilterRequestDto {
  type: string
  value: string
}

export interface GetPostsApiRequestDto {
  readonly page: number
  readonly perPage: number
  readonly filters: GetPostsApiFilterRequestDto[]
  readonly orderBy: string
  readonly order: string
}
