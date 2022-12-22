export interface UpdatePostCommentApiRequestDto {
  readonly postId: string
  readonly postCommentId: string
  readonly postParentId: string | null
  readonly comment: string
  readonly userId: string
}