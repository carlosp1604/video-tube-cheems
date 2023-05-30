import { UserApplicationDto } from '../../../Auth/Application/Dtos/UserApplicationDto'
import { ChildCommentApplicationDto } from './ChildCommentApplicationDto'

export interface CommentApplicationDto {
  readonly id: string
  readonly comment: string
  readonly postId: string
  readonly userId: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly user: UserApplicationDto
  readonly childComments: ChildCommentApplicationDto[]
}
