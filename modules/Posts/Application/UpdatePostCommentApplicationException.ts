import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class UpdatePostCommentApplicationException extends ApplicationException {
  public static cannotUpdateCommentId = 'update_post_comment_cannot_add_comment'
  public static postNotFoundId = 'update_post_comment_post_not_found'
  public static userNotFoundId = 'update_post_comment_user_not_found'

  public static cannotUpdateComment (
    postCommentId: PostComment['id'],
    postId: Post['id']
  ): UpdatePostCommentApplicationException {
    return new UpdatePostCommentApplicationException(
      `Cannot update comment with ID ${postCommentId} from post with ID ${postId}`,
      this.cannotUpdateCommentId
    )
  }

  public static postNotFound (postId: Post['id']): UpdatePostCommentApplicationException {
    return new UpdatePostCommentApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): UpdatePostCommentApplicationException {
    return new UpdatePostCommentApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }
}
