import { ChildCommentApplicationDto } from './ChildCommentApplicationDto'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'

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
