export interface CreatePostChildCommentApplicationRequestDto {
  readonly comment: string
  readonly postId: string
  readonly parentCommentId: string
  readonly userId: string
}
