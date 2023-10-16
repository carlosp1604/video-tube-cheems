import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'

export class PostMediaDomainException extends DomainException {
  public static cannotGetMediaUrlId = 'post_media_domain_cannot_get_media_url'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, PostMediaDomainException.prototype)
  }

  public static cannotGetMediaUrl (mediaUrlId: PostMedia['mediaUrlId']): PostMediaDomainException {
    return new PostMediaDomainException(
      `Cannot get mediaUrl with ID ${mediaUrlId} from postMedia`,
      this.cannotGetMediaUrlId
    )
  }
}
