
import { VideoProvider } from '~/modules/Posts/Domain/VideoUrls/VideoProvider'
import { VideoProviderApplicationDto } from '~/modules/Posts/Application/Dtos/VideoProviderApplicationDto'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class VideoProviderApplicationDtoTranslator {
  public static fromDomain (videoProvider: VideoProvider): VideoProviderApplicationDto {
    return {
      id: videoProvider.id,
      name: videoProvider.name,
      logoUrl: videoProvider.logoUrl,
    }
  }
}
