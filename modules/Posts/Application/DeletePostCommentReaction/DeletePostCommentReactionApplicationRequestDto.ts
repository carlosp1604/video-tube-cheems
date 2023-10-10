export interface DeletePostCommentReactionApplicationRequestDto {
  readonly postCommentId: string
  readonly userId: string
  readonly parentCommentId: string | null
}
