import {
  MediaUrlComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export interface PostMediaComponentDto {
  readonly id: string
  readonly type: string
  readonly title: string
  readonly postId: string
  readonly thumbnailUrl: string | null
  readonly urls: MediaUrlComponentDto[]
  readonly downloadUrls: MediaUrlComponentDto[]
}
