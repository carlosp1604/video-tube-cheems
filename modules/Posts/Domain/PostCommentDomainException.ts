import { DomainException } from '../../Exceptions/Domain/DomainException'
import { PostComment } from './PostComment'

export class PostCommentDomainException extends DomainException {
  public static cannotAddChildCommentId = 'post_comment_domain_cannot_add_child_comment'
  public static userAlreadySetId = 'post_comment_domain_user_already_set'
  public static userIsNotSetId = 'post_comment_domain_user_is_not_set'
  public static cannotCreateCommentId = 'post_comment_domain_cannot_create_comment'

  public static cannotAddChildComment(
    parentComment: PostComment['id'],
    childComment: PostComment['id']
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Comment with ID ${childComment} cannot be child of comment with ID ${parentComment}`,
      this.cannotAddChildCommentId
    )
  }

  public static userAlreadySet(
    parentComment: PostComment['id'],
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Comment with ID ${parentComment} already has an user`,
      this.userAlreadySetId
    )
  }

  public static userIsNotSet(
    parentComment: PostComment['id'],
  ): PostCommentDomainException {
    return new PostCommentDomainException(
      `Comment with ID ${parentComment} has not an user`,
      this.userIsNotSetId
    )
  }

  public static cannotCreateComment(): PostCommentDomainException {
    return new PostCommentDomainException(
      'You must provide a postId or postParentId to create a new comment.',
      this.cannotCreateCommentId
    )
  }
}