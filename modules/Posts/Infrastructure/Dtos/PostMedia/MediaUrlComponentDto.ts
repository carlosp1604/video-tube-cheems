import { MediaProviderComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaProviderComponentDto'

export interface MediaUrlComponentDto {
  readonly title: string
  readonly url: string
  readonly type: string
  readonly provider: MediaProviderComponentDto
}
