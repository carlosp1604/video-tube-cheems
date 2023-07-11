export interface CreatePostCommentApplicationRequestDto {
  readonly comment: string
  readonly postId: string
  readonly userId: string
}
