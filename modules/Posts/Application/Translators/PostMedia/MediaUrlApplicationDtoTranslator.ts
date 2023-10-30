import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'
import {
  MediaProviderApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostMedia/MediaProviderApplicationDtoTranslator'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class MediaUrlApplicationDtoTranslator {
  public static fromDomain (mediaUrl: MediaUrl): MediaUrlApplicationDto {
    return {
      title: mediaUrl.title,
      url: mediaUrl.url,
      providerId: mediaUrl.providerId,
      provider: MediaProviderApplicationDtoTranslator.fromDomain(mediaUrl.provider),
      type: mediaUrl.type,
      postMediaId: mediaUrl.postMediaId,
    }
  }
}
