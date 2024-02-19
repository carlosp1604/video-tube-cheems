import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'

export class MediaUrlsHelper {
  public static getVideoAccessUrl (
    postMediaVideoType: PostMediaComponentDto[],
    postMediaEmbedType: PostMediaComponentDto[]
  ): MediaUrlComponentDto[] {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (postMediaEmbedType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaEmbedType[0].urls]
    }

    if (postMediaVideoType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaVideoType[0].urls]
    }

    return mediaUrls
  }

  public static getVideoDownloadUrl (
    postMediaVideoType: PostMediaComponentDto[],
    postMediaEmbedType: PostMediaComponentDto[]
  ): MediaUrlComponentDto[] {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (postMediaEmbedType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaEmbedType[0].downloadUrls]
    }

    if (postMediaVideoType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaVideoType[0].downloadUrls]
    }

    return mediaUrls
  }
}
