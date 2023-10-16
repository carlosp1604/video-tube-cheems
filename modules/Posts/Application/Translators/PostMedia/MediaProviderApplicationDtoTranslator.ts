import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'
import { MediaProviderApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaProviderApplicationDto'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class MediaProviderApplicationDtoTranslator {
  public static fromDomain (mediaProvider: MediaProvider): MediaProviderApplicationDto {
    return {
      id: mediaProvider.id,
      name: mediaProvider.name,
      logoUrl: mediaProvider.logoUrl,
    }
  }
}
