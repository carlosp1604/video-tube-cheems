import {
  MediaUrlComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export interface PostMediaComponentDto {
  readonly id: string
  readonly videoUrls: MediaUrlComponentDto[]
  readonly embedUrls: MediaUrlComponentDto[]
  readonly imageUrls: MediaUrlComponentDto[]
}
