import { MediaProviderComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaProviderComponentDto'

export interface MediaUrlComponentDto {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly url: string
  readonly provider: MediaProviderComponentDto
  readonly thumbnailUrl: string | null
  readonly downloadUrl: string | null
}
