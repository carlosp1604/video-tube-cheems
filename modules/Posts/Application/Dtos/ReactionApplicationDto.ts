import { Reaction } from '../../Domain/PostReaction'

export interface ReactionApplicationDto {
  readonly postId: string
  readonly userId: string
  readonly reactionType: Reaction
  readonly createdAt: string
  readonly updatedAt: string
}