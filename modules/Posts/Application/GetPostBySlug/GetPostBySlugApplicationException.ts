import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'

export class GetPostBySlugApplicationException extends ApplicationException {
  public static postNotFoundId = 'get_post_by_slug_post_not_found'

  public static postNotFound (slug: Post['slug']): GetPostBySlugApplicationException {
    return new GetPostBySlugApplicationException(
      `Post with slug ${slug} was not found`,
      this.postNotFoundId
    )
  }
}
