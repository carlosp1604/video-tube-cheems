import { UserPostCommentComponentDto } from './UserPostCommentComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'

export interface PostChildCommentComponentDto {
  id: string
  comment: string
  createdAt: string
  user: UserPostCommentComponentDto
  parentCommentId: string
  reactionsNumber: number
  userReaction: ReactionComponentDto | null
}
