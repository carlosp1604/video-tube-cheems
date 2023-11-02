import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'

export class VideoPostPlayerHelper {
  public static getSelectableUrls (
    embedPostMedia: PostMediaComponentDto | null,
    videoPostMedia: PostMediaComponentDto | null
  ):MediaUrlComponentDto[] {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (embedPostMedia !== null) {
      mediaUrls = [...mediaUrls, ...embedPostMedia.urls]
    }

    if (videoPostMedia !== null && videoPostMedia.urls.length > 0) {
      mediaUrls = [...mediaUrls, videoPostMedia.urls[0]]
    }

    return mediaUrls
  }

  public static getFirstMediaUrl (mediaUrls: MediaUrlComponentDto[]): MediaUrlComponentDto | null {
    if (mediaUrls.length === 0) {
      return null
    }

    return mediaUrls[0]
  }
}
