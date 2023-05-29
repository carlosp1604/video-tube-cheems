import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class AddPostViewApplicationException extends ApplicationException {
  public static cannotCreatePostViewId = 'add_post_view_cannot_add_post_view'
  public static postNotFoundId = 'add_post_view_comment_post_not_found'
  public static userNotFoundId = 'add_post_view_comment_user_not_found'

  public static postNotFound (postId: Post['id']): AddPostViewApplicationException {
    return new AddPostViewApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): AddPostViewApplicationException {
    return new AddPostViewApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static cannotCreatePostView (postId: Post['id']): AddPostViewApplicationException {
    return new AddPostViewApplicationException(
      `Cannot add a new post view for post with ID ${postId}`,
      this.cannotCreatePostViewId
    )
  }
}
