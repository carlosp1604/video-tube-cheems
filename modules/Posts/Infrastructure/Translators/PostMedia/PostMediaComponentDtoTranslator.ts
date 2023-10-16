
import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  MediaUrlComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaUrlComponentDtoTranslator'

export abstract class PostMediaComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostMediaApplicationDto): PostMediaComponentDto {
    return {
      id: applicationDto.id,
      postId: applicationDto.postId,
      type: applicationDto.type,
      title: applicationDto.title,
      thumbnailUrl: applicationDto.thumbnailUrl,
      urls: applicationDto.mediaUrls.map((mediaUrl) => {
        return MediaUrlComponentDtoTranslator.fromApplicationDto(mediaUrl)
      }),
    }
  }
}
