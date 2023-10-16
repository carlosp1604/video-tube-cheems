import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'
import {
  MediaProviderComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaProviderComponentDtoTranslator'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export abstract class MediaUrlComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: MediaUrlApplicationDto): MediaUrlComponentDto {
    return {
      provider: MediaProviderComponentDtoTranslator.fromApplicationDto(applicationDto.provider),
      url: applicationDto.url,
      title: applicationDto.title,
      id: applicationDto.id,
      type: applicationDto.type,
      thumbnailUrl: applicationDto.thumbnailUrl,
      downloadUrl: applicationDto.downloadUrl,
    }
  }
}
