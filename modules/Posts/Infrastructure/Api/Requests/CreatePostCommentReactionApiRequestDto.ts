export interface CreatePostCommentReactionApiRequestDto {
  postCommentId: string
  userId: string
  parentCommentId: string | null
}
