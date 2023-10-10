export interface UpdatePostCommentApiRequestDto {
  readonly postId: string
  readonly postCommentId: string
  readonly parentCommentId: string | null
  readonly comment: string
  readonly userId: string
}