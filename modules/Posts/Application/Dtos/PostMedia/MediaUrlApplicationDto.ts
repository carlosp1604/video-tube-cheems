import { MediaProviderApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaProviderApplicationDto'

export interface MediaUrlApplicationDto {
  readonly title: string
  readonly providerId: string
  readonly postMediaId: string
  readonly url: string
  readonly downloadUrl: string | null
  readonly provider: MediaProviderApplicationDto
}
