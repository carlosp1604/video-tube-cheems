export interface DeletePostCommentApiRequestDto {
  readonly postId: string
  readonly postCommentId: string
  readonly parentCommentId: string | null
  readonly userId: string
}
