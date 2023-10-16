import { MediaProviderApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaProviderApplicationDto'

export interface MediaUrlApplicationDto {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly providerId: string
  readonly postMediaId: string
  readonly url: string
  readonly downloadUrl: string | null
  readonly thumbnailUrl: string | null
  readonly provider: MediaProviderApplicationDto
}
