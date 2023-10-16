import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'
import {
  MediaProviderComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaProviderComponentDtoTranslator'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export abstract class MediaUrlComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: MediaUrlApplicationDto): MediaUrlComponentDto {
    return {
      title: applicationDto.title,
      url: applicationDto.url,
      downloadUrl: applicationDto.downloadUrl,
      provider: MediaProviderComponentDtoTranslator.fromApplicationDto(applicationDto.provider),
    }
  }
}
