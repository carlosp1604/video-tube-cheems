import { MediaProviderComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaProviderComponentDto'
import { MediaProviderApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaProviderApplicationDto'

export abstract class MediaProviderComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: MediaProviderApplicationDto): MediaProviderComponentDto {
    return {
      logoUrl: applicationDto.logoUrl,
      name: applicationDto.name,
    }
  }
}
