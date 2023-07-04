import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'

export interface GetPostBySlugApplicationResponseDto {
  readonly post: PostApplicationDto
  readonly reactions: number
  readonly comments: number
  readonly views: number
}
