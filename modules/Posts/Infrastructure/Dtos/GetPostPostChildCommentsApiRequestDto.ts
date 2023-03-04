export interface GetPostPostChildCommentsApiRequestDto {
  readonly postId: string
  readonly page: number,
  readonly perPage: number,
  readonly parentCommentId: string
}