import { DomainException } from '../../Exceptions/Domain/DomainException'
import { PostComment } from './PostComment'

export class PostDomainException extends DomainException {
  public static parentCommentNotFoundId = 'post_domain_parent_comment_not_found'
  public static cannotDeleteCommentId = 'post_domain_cannot_delete_comment'
  public static cannotAddCommentId = 'post_domain_cannot_add_comment'
  public static cannotUpdateCommentId = 'post_domain_update_delete_comment'

  public static parentCommentNotFound(parentCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Comment with ID ${parentCommentId} was not found`,
      this.parentCommentNotFoundId
    )
  }

  public static cannotDeleteComment(postCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Cannot delete comment with ID ${postCommentId}`,
      this.parentCommentNotFoundId
    )
  }

  public static cannotAddComment(postCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Cannot add comment with ID ${postCommentId}`,
      this.parentCommentNotFoundId
    )
  }

  public static cannotUpdateComment(postCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Cannot update comment with ID ${postCommentId}`,
      this.parentCommentNotFoundId
    )
  }
}