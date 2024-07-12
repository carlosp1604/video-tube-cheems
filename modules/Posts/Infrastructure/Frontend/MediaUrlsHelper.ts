import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  sanboxableProviders,
  sandboxableIfLoggedIn
} from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/SanboxableProviders'

/**
 * Supreme Admin Uuid = f373b07d-fc3e-42a5-9543-c59d503324aa
 * This should be retrieved from database
 * */
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
    embedPostMedia: PostMediaComponentDto | null,
    videoPostMedia: PostMediaComponentDto | null,
    userId: string | null
  ):MediaUrlComponentDto[] {
    const mediaUrls: MediaUrlComponentDto[] = []

    if (videoPostMedia !== null) {
      if (videoPostMedia.urls.length > 0) {
        mediaUrls.push(videoPostMedia.urls[0])
      }
    }

    if (embedPostMedia !== null) {
      for (const embedPostMediaUrl of embedPostMedia.urls) {
        mediaUrls.push(embedPostMediaUrl)
      }
    }

    return MediaUrlsHelper.sortMediaUrl(MediaUrlsHelper.filterProviders(mediaUrls, userId))
  }

  public static shouldBeSanboxed (providerId: string, authenticated: boolean): boolean {
    if (sanboxableProviders.includes(providerId)) {
      return true
    }

    if (sandboxableIfLoggedIn.includes(providerId) && authenticated) {
      return true
    }

    return false
  }

  public static shouldShowExtraAdvertising (providerId: string): boolean {
    if (providerId !== 'edf20c13-f085-4d0e-a124-567fdc42cf9f') { // for the moment, just ph
      return true
    }

    return false
  }

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
  public static sortMediaUrl (
    mediaUrls: MediaUrlComponentDto[],
    download = false
  ): MediaUrlComponentDto[] {
    const providersAccessOrder = [
      { id: '9a51b189-0cbe-4c68-822a-440b61301ec0' }, // Direct
      { id: 'ab535237-2262-4763-2443-dfec1a6ec1b9' }, // Vidhide
      { id: '35677ea5-3641-4319-ae6f-1fe145c9b797' }, // Lulustream
      { id: 'b06ba1c1-4988-4b90-8271-a23a56fb0f61' }, // Filemoon
      { id: '6a594991-7364-481d-85f1-62c5ba2b6cb3' }, // Vtube
      { id: '70802e86-7a26-463b-8036-81d7d4ceac1a' }, // Voe
      { id: 'baa39748-8402-4378-b296-3ca653e97f9a' }, // Doodstream
      { id: '9327efd9-4ac5-4ddc-a7e0-bae8c46eb189' }, // Vidguard
      { id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc' }, // Wolfstream
      { id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c' }, // Fastream
    ]

    const providersDownloadOrder = [
      { id: '9a51b189-0cbe-4c68-822a-440b61301ec0' }, // Direct
      { id: 'e0f92228-068c-43a5-a61f-b7262f124868' }, // Katfile
      { id: '3810a3c5-e4d1-4c99-bee0-7b611aafc89b' }, // 1fichier
      { id: '6a594991-7364-481d-85f1-62c5ba2b6cb3' }, // Vtube
      { id: 'ab535237-2262-4763-2443-dfec1a6ec1b9' }, // Vidhide
      { id: 'b06ba1c1-4988-4b90-8271-a23a56fb0f61' }, // Filemoon
      { id: '9327efd9-4ac5-4ddc-a7e0-bae8c46eb189' }, // Vidguard
      { id: '70802e86-7a26-463b-8036-81d7d4ceac1a' }, // Voe
      { id: 'baa39748-8402-4378-b296-3ca653e97f9a' }, // Doodstream
      { id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc' }, // Wolfstream
      { id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c' }, // Fastream
      { id: '35677ea5-3641-4319-ae6f-1fe145c9b797' }, // Lulustream
    ]

    let order = providersAccessOrder

    if (download) {
      order = providersDownloadOrder
    }

    let currentPointer = -1

    for (const providerOrder of order) {
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

    return mediaUrls
  }
}
