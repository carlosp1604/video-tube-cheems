import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class DeletePostCommentApplicationException extends ApplicationException {
  public static cannotDeleteCommentId = 'delete_post_comment_cannot_add_comment'
  public static postNotFoundId = 'delete_post_comment_post_not_found'
  public static userNotFoundId = 'delete_post_comment_user_not_found'

  public static cannotDeleteComment (
    postCommentId: PostComment['id'],
    postId: Post['id']
  ): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Cannot delete comment with ID ${postCommentId} from post with ID ${postId}`,
      this.cannotDeleteCommentId
    )
  }

  public static postNotFound (postId: Post['id']): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }
}
