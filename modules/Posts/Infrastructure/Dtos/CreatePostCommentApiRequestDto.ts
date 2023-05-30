export interface CreatePostCommentApiRequestDto {
  readonly comment: string
  readonly postId: string
  readonly userId: string
}