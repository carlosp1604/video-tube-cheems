import { VideoProviderApplicationDto } from '~/modules/Posts/Application/Dtos/VideoProviderApplicationDto'

export interface VideoUrlApplicationDto {
  readonly type: string
  readonly providerId: string
  readonly postId: string
  readonly url: string
  readonly provider: VideoProviderApplicationDto
}
