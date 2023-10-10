export interface CreatePostCommentReactionApplicationRequest {
  userId: string
  postCommentId: string
  parentCommentId: string | null
}
