import { MediaProviderApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaProviderApplicationDto'

export interface MediaUrlApplicationDto {
  readonly title: string
  readonly providerId: string
  readonly postMediaId: string
  readonly url: string
  readonly type: string
  readonly provider: MediaProviderApplicationDto
}
