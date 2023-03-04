import { PostApplicationDto } from './PostApplicationDto'

export interface GetPostByIdApplicationResponseDto {
  readonly post: PostApplicationDto
  readonly reactions: number
  readonly comments: number
}