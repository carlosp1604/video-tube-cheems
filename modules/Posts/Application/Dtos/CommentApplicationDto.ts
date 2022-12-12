import { UserApplicationDto } from '../../../Auth/Application/UserApplicationDto'

export interface CommentApplicationDto {
  readonly id: string
  readonly comment: string
  readonly postId: string | null
  readonly userId: string
  readonly parentCommentId: string | null
  readonly createdAt: string
  readonly updatedAt: string
  readonly user: UserApplicationDto
  readonly childComments: CommentApplicationDto[]
}