import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { VideoProvider } from '~/modules/Posts/Domain/VideoUrls/VideoProvider'

export class VideoUrlDomainException extends DomainException {
  public static cannotGetProviderId = 'video_url_domain_cannot_get_provider'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, VideoUrlDomainException.prototype)
  }

  public static cannotGetProvider (providerId: VideoProvider['id']): VideoUrlDomainException {
    return new VideoUrlDomainException(
      `Cannot get provider with ID ${providerId} from videoUrl`,
      this.cannotGetProviderId
    )
  }
}
