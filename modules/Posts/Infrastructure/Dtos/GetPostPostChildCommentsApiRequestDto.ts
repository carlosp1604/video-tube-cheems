export interface GetPostPostChildCommentsApiRequestDto {
  readonly page: number
  readonly perPage: number
  readonly parentCommentId: string
}
