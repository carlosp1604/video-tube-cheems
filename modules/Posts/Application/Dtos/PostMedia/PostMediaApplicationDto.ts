import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'

export interface PostMediaApplicationDto {
  readonly id: string
  readonly postId: string
  readonly mediaUrls: MediaUrlApplicationDto[]
}
