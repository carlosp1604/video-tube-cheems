
import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  MediaUrlComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaUrlComponentDtoTranslator'

export abstract class PostMediaComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostMediaApplicationDto): PostMediaComponentDto {
    return {
      id: applicationDto.id,
      embedUrls: applicationDto.mediaUrls.filter((mediaUrl) => mediaUrl.type === 'Embed')
        .map((mediaUrl) => {
          return MediaUrlComponentDtoTranslator.fromApplicationDto(mediaUrl)
        }),
      videoUrls: applicationDto.mediaUrls.filter((mediaUrl) => mediaUrl.type === 'Video')
        .map((mediaUrl) => {
          return MediaUrlComponentDtoTranslator.fromApplicationDto(mediaUrl)
        }),
      imageUrls: applicationDto.mediaUrls.filter((mediaUrl) => mediaUrl.type === 'Image')
        .map((mediaUrl) => {
          return MediaUrlComponentDtoTranslator.fromApplicationDto(mediaUrl)
        }),
    }
  }
}
