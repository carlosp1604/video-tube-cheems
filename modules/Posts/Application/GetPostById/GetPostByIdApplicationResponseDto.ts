import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'

export interface GetPostByIdApplicationResponseDto {
  readonly post: PostApplicationDto
  readonly reactions: number
  readonly comments: number
  readonly views: number
  readonly userReaction: PostReactionApplicationDto | null
}
