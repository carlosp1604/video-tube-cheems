import { PostApplicationDto } from '../Dtos/PostApplicationDto'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'

export interface GetPostByIdApplicationResponseDto {
  readonly post: PostApplicationDto
  readonly reactions: number
  readonly comments: number
  readonly views: number
  readonly userReaction: PostReactionApplicationDto | null
}
