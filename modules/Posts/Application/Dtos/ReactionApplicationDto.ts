import { Reaction } from '~/modules/Posts/Domain/PostReaction'

export interface ReactionApplicationDto {
  readonly postId: string
  readonly userId: string
  readonly reactionType: Reaction
  readonly createdAt: string
  readonly updatedAt: string
}
