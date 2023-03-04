export interface GetPostPostCommentsApiRequestDto {
  readonly postId: string
  readonly page: number,
  readonly perPage: number,
  readonly parentCommentId: string | null
}