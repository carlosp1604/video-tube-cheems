import { DomainException } from '../../Exceptions/Domain/DomainException'
import { PostComment } from './PostComment'
import { User } from '../../Auth/Domain/User'
import { Post } from './Post'

export class PostDomainException extends DomainException {
  public static parentCommentNotFoundId = 'post_domain_parent_comment_not_found'
  public static cannotDeleteCommentId = 'post_domain_cannot_delete_comment'
  public static cannotAddCommentId = 'post_domain_cannot_add_comment'
  public static cannotAddReactionId = 'post_domain_cannot_add_reaction'
  public static cannotUpdateCommentId = 'post_domain_cannot_update_comment'
  public static cannotUpdateReactionId = 'post_domain_cannot_update_reaction'
  public static userAlreadyReactedId = 'post_domain_user_already_reacted'
  public static userHasNotReactedId = 'post_domain_user_has_not_reacted'
  public static cannotDeleteReactionId = 'post_domain_cannot_delete_reaction'
  public static producerAlreadySetId = 'post_domain_producer_already_set'

  public static parentCommentNotFound(parentCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Comment with ID ${parentCommentId} was not found`,
      this.parentCommentNotFoundId
    )
  }

  public static cannotDeleteComment(postCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Cannot delete comment with ID ${postCommentId}`,
      this.cannotDeleteCommentId
    )
  }

  public static cannotAddComment(postCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Cannot add comment with ID ${postCommentId}`,
      this.cannotAddCommentId
    )
  }

  public static cannotAddReaction(userId: User['id'], postId: Post['id']): PostDomainException {
    return new PostDomainException(
      `Cannot add reaction from user with ID ${userId} to post with ID ${postId}`,
      this.cannotAddReactionId
    )
  }

  public static cannotUpdateComment(postCommentId: PostComment['id']): PostDomainException {
    return new PostDomainException(
      `Cannot update comment with ID ${postCommentId}`,
      this.cannotUpdateCommentId
    )
  }

  public static cannotUpdateReaction(userId: User['id'], postId: Post['id']): PostDomainException {
    return new PostDomainException(
      `Cannot update reaction from user with ID ${userId} in post with ID ${postId}`,
      this.cannotAddReactionId
    )
  }

  public static userAlreadyReacted(userId: User['id'], postId: Post['id']): PostDomainException {
    return new PostDomainException(
      `User with ID ${userId} already reacted to post with ID ${postId}`,
      this.userAlreadyReactedId
    )
  }

  public static userHasNotReacted(userId: User['id'], postId: Post['id']): PostDomainException {
    return new PostDomainException(
      `User with ID ${userId} has not reacted to post with ID ${postId}`,
      this.userHasNotReactedId
    )
  }

  public static cannotDeleteReaction(userId: User['id'], postId: Post['id']): PostDomainException {
    return new PostDomainException(
      `Cannot delete reaction from user with ID ${userId} in post with ID ${postId}`,
      this.cannotDeleteReactionId
    )
  }

  public static producerAlreadySet(postId: Post['id']): PostDomainException {
    return new PostDomainException(
      `Post with ID ${postId} has already a producer setted`,
      this.producerAlreadySetId
    )
  }
}