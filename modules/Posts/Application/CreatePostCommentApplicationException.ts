import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { User } from '../../Auth/Domain/User'
import { Post } from '../Domain/Post'

export class CreatePostCommentApplicationException extends ApplicationException {
  public static cannotAddCommentId = 'create_post_comment_cannot_add_comment'
  public static postNotFoundId = 'create_post_comment_post_not_found'
  public static userNotFoundId = 'create_post_comment_user_not_found'

  public static cannotAddComment(
    postId: Post['id'],
    userId: User['id']
  ): CreatePostCommentApplicationException {
    return new CreatePostCommentApplicationException(
      `Cannot add comment from user with ID ${userId} to post with ID ${postId}`,
      this.cannotAddCommentId
    )
  }

  public static postNotFound(postId: Post['id']): CreatePostCommentApplicationException {
    return new CreatePostCommentApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound(userId: User['id']): CreatePostCommentApplicationException {
    return new CreatePostCommentApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }
}