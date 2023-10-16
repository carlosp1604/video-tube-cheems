import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'

export class MediaUrlDomainException extends DomainException {
  public static cannotGetProviderId = 'media_url_domain_cannot_get_provider'
  public static invalidMediaUrlTypeId = 'media_url_domain_invalid_media_url_type'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, MediaUrlDomainException.prototype)
  }

  public static cannotGetProvider (providerId: MediaProvider['id']): MediaUrlDomainException {
    return new MediaUrlDomainException(
      `Cannot get provider with ID ${providerId} from mediaUrl`,
      this.cannotGetProviderId
    )
  }

  public static invalidMediaUrlType (value: string): MediaUrlDomainException {
    return new MediaUrlDomainException(
      `Invalid media url type: ${value}`,
      this.invalidMediaUrlTypeId
    )
  }
}
