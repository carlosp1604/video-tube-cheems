import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import { sanboxableProviders } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/SanboxableProviders'

/** Supreme Admin Uuid = 00000000-0000-0000-0000-000000000000 */
export class MediaUrlsHelper {
  public static getVideoAccessUrl (
    postMediaVideoType: PostMediaComponentDto[],
    postMediaEmbedType: PostMediaComponentDto[]
  ): MediaUrlComponentDto[] {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (postMediaVideoType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaVideoType[0].urls]
    }

    if (postMediaEmbedType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaEmbedType[0].urls]
    }

    return MediaUrlsHelper.sortMediaUrl(mediaUrls)
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

  public static getSelectableUrls (
    mediaUrls: MediaUrlComponentDto[],
    userId: string | null
  ):MediaUrlComponentDto[] {
    const selectableUrls : MediaUrlComponentDto[] = []

    for (const mediaUrl of mediaUrls) {
      if (mediaUrl.type === 'Video') {
        const videoUrl = selectableUrls.find((mediaUrl) => {
          return mediaUrl.type === 'Video'
        })

        if (videoUrl) {
          continue
        }
      } else {
        selectableUrls.push(mediaUrl)
      }
    }

    return MediaUrlsHelper.sortMediaUrl(MediaUrlsHelper.filterProviders(mediaUrls, userId))
  }

  public static getFirstMediaUrl (
    mediaUrls: MediaUrlComponentDto[],
    userId: string | null
  ): MediaUrlComponentDto | null {
    const filteredMediaUrls = MediaUrlsHelper.filterProviders(mediaUrls, userId)

    if (filteredMediaUrls.length === 0) {
      return null
    }

    return filteredMediaUrls[0]
  }

  public static shouldBeSanboxed (providerId: string): boolean {
    if (sanboxableProviders.includes(providerId)) {
      return true
    }

    return false
  }

  /** TODO: Set the Admin Uuid and the Direct provider correctly */
  private static filterProviders (mediaUrls: MediaUrlComponentDto[], userId: string | null): MediaUrlComponentDto[] {
    if (!userId || (userId && userId !== '00000000-0000-0000-0000-000000000000')) {
      return mediaUrls.filter((mediaUrl) => {
        return mediaUrl.provider.id !== '9a51b189-0cbe-4c68-822a-440b61301ec0' // Direct provider
      })
    }

    return mediaUrls
  }

  // TODO: This should change when user can decide its own order
  // TODO: For the moment: sync this method with the providers.json file
  private static sortMediaUrl (mediaUrls: MediaUrlComponentDto[]): MediaUrlComponentDto[] {
    const providersOrder = [
      { id: '9a51b189-0cbe-4c68-822a-440b61301ec0' },
      { id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc' },
      { id: 'ab535237-2262-4763-2443-dfec1a6ec1b9' },
      { id: 'baa39748-8402-4378-b296-3ca653e97f9a' },
      { id: '35677ea5-3641-4319-ae6f-1fe145c9b797' },
    ]

    let currentPointer = -1

    for (const providerOrder of providersOrder) {
      const media = mediaUrls.find((mediaUrl) => {
        return mediaUrl.provider.id === providerOrder.id
      })

      if (!media) {
        continue
      }

      const index = mediaUrls.indexOf(media)

      if (index > -1) {
        mediaUrls.splice(index, 1)
        mediaUrls.splice(currentPointer + 1, 0, media)
        currentPointer++
      }
    }

    console.log(mediaUrls)

    return mediaUrls
  }
}
