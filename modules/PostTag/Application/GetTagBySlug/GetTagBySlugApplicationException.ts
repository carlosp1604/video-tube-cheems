import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'

export class GetTagBySlugApplicationException extends ApplicationException {
  public static tagNotFoundId = 'get_tag_by_slug_tag_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetTagBySlugApplicationException.prototype)
  }

  public static tagNotFound (tagSlug: PostTag['slug']): GetTagBySlugApplicationException {
    return new GetTagBySlugApplicationException(
      `Tag with slug ${tagSlug} was not found`,
      this.tagNotFoundId
    )
  }
}
