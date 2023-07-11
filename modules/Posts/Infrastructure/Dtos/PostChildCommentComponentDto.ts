import { UserPostCommentComponentDto } from './UserPostCommentComponentDto'

export interface PostChildCommentComponentDto {
  id: string
  comment: string
  createdAt: string
  user: UserPostCommentComponentDto
  parentCommentId: string
}
