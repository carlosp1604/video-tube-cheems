import { PostComment } from './PostComment'
import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { User } from '~/modules/Auth/Domain/User'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'

export class PostCommentDomainException extends DomainException {
  public static cannotAddChildCommentId = 'post_comment_domain_cannot_add_child_comment'
  public static childCommentNotFoundId = 'post_comment_domain_child_comment_not_found'
  public static userAlreadySetId = 'post_comment_domain_user_already_set'
  public static userIsNotSetId = 'post_comment_domain_user_is_not_set'
  public static userCannotDeleteChildCommentId = 'post_comment_domain_user_cannot_delete_child_comment'
  public static cannotDeleteChildCommentId = 'post_child_comment_domain_cannot_delete_child_comment'

  public static cannotAddChildComment (
    parentComment: PostComment['id'],
    childComment: PostComment['id']
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Comment with ID ${childComment} cannot be child of comment with ID ${parentComment}`,
      this.cannotAddChildCommentId
    )
  }

  public static userAlreadySet (
    parentComment: PostComment['id']
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Comment with ID ${parentComment} already has an user`,
      this.userAlreadySetId
    )
  }

  public static userIsNotSet (
    parentComment: PostComment['id']
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Comment with ID ${parentComment} has not an user`,
      this.userIsNotSetId
    )
  }

  public static childCommentNotFound (childComment: PostComment['id']): PostCommentDomainException {
    return new PostCommentDomainException(
      `Child comment with ID ${childComment} was not found`,
      this.childCommentNotFoundId
    )
  }

  public static cannotDeleteChildComment (childComment: PostComment['id']): PostCommentDomainException {
    return new PostCommentDomainException(
      `Child comment with ID ${childComment} cannot be deleted`,
      this.cannotDeleteChildCommentId
    )
  }

  public static userCannotDeleteChildComment (
    userId: User['id'],
    childComment: PostChildComment['id']
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Child comment with ID ${childComment} does not belong to user with ID ${userId}`,
      this.userCannotDeleteChildCommentId
    )
  }
}
