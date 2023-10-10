import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'

export interface PostReactionsInterface {
  like: number
  dislike: number
}

export interface GetPostBySlugApplicationResponseDto {
  readonly post: PostApplicationDto
  readonly reactions: PostReactionsInterface
  readonly comments: number
  readonly views: number
}
