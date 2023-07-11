export interface CreatePostChildCommentApiRequestDto {
  readonly postId: string
  readonly comment: string
  readonly userId: string
  readonly parentCommentId: string
}
