export interface DeletePostCommentReactionApiRequestDto {
  postCommentId: string
  userId: string
  parentCommentId: string | null
}
