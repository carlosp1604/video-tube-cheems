import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'

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
    postMediaEmbedType: PostMediaComponentDto[],
    postMediaVideoType: PostMediaComponentDto[]
  ):MediaUrlComponentDto[] {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (postMediaEmbedType.length > 0) {
      mediaUrls = [...mediaUrls, ...postMediaEmbedType[0].urls]
    }

    if (postMediaVideoType.length > 0) {
      if (postMediaVideoType[0].urls.length > 0) {
        mediaUrls = [...mediaUrls, postMediaVideoType[0].urls[0]]
      }
    }

    return MediaUrlsHelper.sortMediaUrl(mediaUrls)
      .filter((mediaUrl) => mediaUrl.provider.id !== 'b06ba1c1-4988-4b90-8271-a23a56fb0f61')
  }

  // TODO: This should change when user can decide its own order
  // TODO: For the moment: sync this method with the providers.json file
  public static sortMediaUrl (
    mediaUrls: MediaUrlComponentDto[],
    download = false
  ): MediaUrlComponentDto[] {
    const providersAccessOrder = [
      { id: 'baa39748-8402-4378-b296-3ca653e97f9a' }, // Doodstream
      { id: '35677ea5-3641-4319-ae6f-1fe145c9b797' }, // Lulustream
      { id: '6a594991-7364-481d-85f1-62c5ba2b6cb3' }, // Vtube
      { id: '8dfb8312-ab59-49df-8047-3a3413512c10' }, // Upnshare
      { id: 'ab535237-2262-4763-2443-dfec1a6ec1b9' }, // Vidhide
      { id: '3a0b5a54-0814-4877-9e97-27607866f7b9' }, // Bigwarp
      { id: '9a51b189-0cbe-4c68-822a-440b61301ec0' }, // Direct
      { id: 'b06ba1c1-4988-4b90-8271-a23a56fb0f61' }, // Filemoon
      { id: '70802e86-7a26-463b-8036-81d7d4ceac1a' }, // Voe
      { id: '9327efd9-4ac5-4ddc-a7e0-bae8c46eb189' }, // Vidguard
      { id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc' }, // Wolfstream
      { id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c' }, // Fastream
    ]

    const providersDownloadOrder = [
      { id: '9a51b189-0cbe-4c68-822a-440b61301ec0' }, // Direct
      { id: 'e0f92228-068c-43a5-a61f-b7262f124868' }, // Katfile
      { id: '3a0b5a54-0814-4877-9e97-27607866f7b9' }, // Bigwarp
      { id: 'ab535237-2262-4763-2443-dfec1a6ec1b9' }, // Vidhide
      { id: '3810a3c5-e4d1-4c99-bee0-7b611aafc89b' }, // 1fichier
      { id: 'b06ba1c1-4988-4b90-8271-a23a56fb0f61' }, // Filemoon
      { id: '9327efd9-4ac5-4ddc-a7e0-bae8c46eb189' }, // Vidguard
      { id: '70802e86-7a26-463b-8036-81d7d4ceac1a' }, // Voe
      { id: 'baa39748-8402-4378-b296-3ca653e97f9a' }, // Doodstream
      { id: '6a594991-7364-481d-85f1-62c5ba2b6cb3' }, // Vtube
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
