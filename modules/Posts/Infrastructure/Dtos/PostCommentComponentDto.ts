import { UserPostCommentComponentDto } from './UserPostCommentComponentDto'

export interface PostCommentComponentDto {
  id: string
  comment: string
  postId: string
  createdAt: string
  user: UserPostCommentComponentDto
  repliesNumber: number
}