import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'

export class MediaUrlDomainException extends DomainException {
  public static cannotGetProviderId = 'media_url_domain_cannot_get_provider'

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
}
