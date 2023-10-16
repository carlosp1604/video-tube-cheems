import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'

export class PostMediaDomainException extends DomainException {
  public static invalidPostMediaTypeId = 'post_media_domain_invalid_post_media_type'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, PostMediaDomainException.prototype)
  }

  public static invalidPostMediaType (postMediaId: PostMedia['id'], value: string): PostMediaDomainException {
    return new PostMediaDomainException(
      `Invalid post media type: ${value} for Post Media with ID ${postMediaId}`,
      this.invalidPostMediaTypeId
    )
  }
}
