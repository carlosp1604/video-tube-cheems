import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'

export interface GetPostBySlugApplicationResponseDto {
  readonly post: PostApplicationDto
  readonly views: number
  readonly externalLink: string | null
}
