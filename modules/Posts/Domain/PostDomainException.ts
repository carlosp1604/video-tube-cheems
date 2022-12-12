import { DomainException } from '../../Exceptions/Domain/DomainException'
import { PostComment } from './PostComment'

export class PostDomainException extends DomainException {
  public static parentCommentNotFoundId = 'post_domain_parent_comment_not_found'

  public static parentCommentNotFound(parentCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Comment with ID ${parentCommentId} was not found`,
      this.parentCommentNotFoundId
    )
  }
}