import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export interface GetPostUserInteractionApplicationResponseDto {
  userReaction: ModelReactionApplicationDto | null
  savedPost: boolean
}
