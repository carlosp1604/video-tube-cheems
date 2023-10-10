import { VideoUrlApplicationDto } from '~/modules/Posts/Application/Dtos/VideoUrlApplicationDto'
import {
  VideoDownloadUrlComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'

export abstract class VideoDownloadUrlComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: VideoUrlApplicationDto): VideoDownloadUrlComponentDto {
    return {
      url: applicationDto.url,
      logoUrl: applicationDto.provider.logoUrl,
      name: applicationDto.provider.name,
    }
  }
}
