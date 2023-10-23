import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export interface GetPostUserInteractionApplicationDto {
  userReaction: ModelReactionApplicationDto | null
  savedPost: boolean
}
