export interface CreatePostCommentRequestDto {
  readonly comment: string
  readonly postId: string
  readonly userId: string
}