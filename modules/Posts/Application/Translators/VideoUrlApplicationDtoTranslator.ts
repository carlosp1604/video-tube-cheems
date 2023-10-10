
import { VideoUrlApplicationDto } from '~/modules/Posts/Application/Dtos/VideoUrlApplicationDto'
import { VideoUrl } from '~/modules/Posts/Domain/VideoUrls/VideoUrl'
import {
  VideoProviderApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/VideoProviderApplicationDtoTranslator'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class VideoUrlApplicationDtoTranslator {
  public static fromDomain (videoUrl: VideoUrl): VideoUrlApplicationDto {
    return {
      type: videoUrl.type,
      url: videoUrl.url,
      postId: videoUrl.postId,
      providerId: videoUrl.providerId,
      provider: VideoProviderApplicationDtoTranslator.fromDomain(videoUrl.provider),
    }
  }
}
