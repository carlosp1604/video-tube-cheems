import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  MediaUrlComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaUrlComponentDtoTranslator'

export abstract class PostMediaComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostMediaApplicationDto): PostMediaComponentDto {
    const urls = applicationDto.mediaUrls
      .filter((mediaUrl) => mediaUrl.type === 'access-url')

    const downloadUrls = applicationDto.mediaUrls
      .filter((mediaUrl) => mediaUrl.type === 'download-url')

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
}
