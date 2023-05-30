export interface UserPostCommentCardComponentDto {
  id: string
  name: string
  imageUrl: string | null
}

export interface PostCommentCardComponentDto {
  id: string
  comment: string
  createdAt: string
  user: UserPostCommentCardComponentDto
}