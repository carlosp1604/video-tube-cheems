import { VideoUrlApplicationDto } from '~/modules/Posts/Application/Dtos/VideoUrlApplicationDto'
import { VideoEmbedUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'

export abstract class VideoEmbedUrlComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: VideoUrlApplicationDto): VideoEmbedUrlComponentDto {
    return {
      url: applicationDto.url,
      logoUrl: applicationDto.provider.logoUrl,
      name: applicationDto.provider.name,
    }
  }
}
