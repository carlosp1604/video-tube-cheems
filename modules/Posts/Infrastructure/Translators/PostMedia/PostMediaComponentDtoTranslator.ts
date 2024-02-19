import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  MediaUrlComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaUrlComponentDtoTranslator'
import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'

export abstract class PostMediaComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostMediaApplicationDto): PostMediaComponentDto {
    const urls = PostMediaComponentDtoTranslator.sortMediaUrl(applicationDto.mediaUrls
      .filter((mediaUrl) => mediaUrl.type === 'access-url'))

    const downloadUrls = PostMediaComponentDtoTranslator.sortMediaUrl(applicationDto.mediaUrls
      .filter((mediaUrl) => mediaUrl.type === 'download-url'))

    return {
      id: applicationDto.id,
      postId: applicationDto.postId,
      type: applicationDto.type,
      title: applicationDto.title,
      thumbnailUrl: applicationDto.thumbnailUrl,
      urls: urls
        .map((mediaUrl) => {
          return MediaUrlComponentDtoTranslator.fromApplicationDto(mediaUrl)
        }),
      downloadUrls: downloadUrls
        .map((mediaUrl) => {
          return MediaUrlComponentDtoTranslator.fromApplicationDto(mediaUrl)
        }),
    }
  }

  // TODO: This should change when user can decide its own order
  // TODO: For the moment: sync this method with the providers.json file
  private static sortMediaUrl (mediaUrls: MediaUrlApplicationDto[]): MediaUrlApplicationDto[] {
    const providersOrder = [
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

    return mediaUrls
  }
}
