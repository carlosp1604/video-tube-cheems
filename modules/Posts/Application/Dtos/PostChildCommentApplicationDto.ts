import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'

export interface PostChildCommentApplicationDto {
  readonly id: string
  readonly comment: string
  readonly userId: string
  readonly parentCommentId: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly user: UserApplicationDto
}
