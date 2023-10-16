import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'

export interface PostMediaApplicationDto {
  readonly id: string
  readonly type: string
  readonly title: string
  readonly thumbnailUrl: string | null
  readonly postId: string
  readonly mediaUrls: MediaUrlApplicationDto[]
}
