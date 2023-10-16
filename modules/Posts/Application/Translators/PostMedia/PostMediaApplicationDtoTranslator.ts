import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'
import {
  MediaUrlApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostMedia/MediaUrlApplicationDtoTranslator'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class PostMediaApplicationDtoTranslator {
  public static fromDomain (postMedia: PostMedia): PostMediaApplicationDto {
    return {
      id: postMedia.id,
      postId: postMedia.postId,
      mediaUrls: postMedia.mediaUrls.map((mediaUrl) => {
        return MediaUrlApplicationDtoTranslator.fromDomain(mediaUrl)
      }),
    }
  }
}
