export interface UserPostCommentComponentDto {
  id: string
  name: string
  imageUrl: string | null
}

export interface PostCommentComponentDto {
  id: string
  comment: string
  postId: string
  parentCommentId: string | null
  createdAt: string
  user: UserPostCommentComponentDto
  repliesNumber: number
}