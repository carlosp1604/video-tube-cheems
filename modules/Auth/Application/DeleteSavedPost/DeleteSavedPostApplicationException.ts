import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'
import { Post } from '~/modules/Posts/Domain/Post'

export class DeleteSavedPostApplicationException extends ApplicationException {
  public static postDoesNotExistOnSavedPostsId = 'delete_saved_post_post_does_not_exist_on_saved_posts'
  public static userNotFoundId = 'delete_saved_post_user_not_found'
  public static postNotFoundId = 'delete_saved_post_post_not_found'
  public static cannotDeletePostFromSavedPostsId = 'delete_saved_post_cannot_delete_post_from_saved_posts'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, DeleteSavedPostApplicationException.prototype)
  }

  public static postDoesNotExistOnSavedPosts (
    userId: User['id'],
    postId: Post['id']
  ): DeleteSavedPostApplicationException {
    return new DeleteSavedPostApplicationException(
      `Post with ID ${postId} does not exists on the user with ID ${userId} saved posts list`,
      this.postDoesNotExistOnSavedPostsId
    )
  }

  public static cannotDeletePostFromSavedPosts (
    userId: User['id'],
    postId: Post['id']
  ): DeleteSavedPostApplicationException {
    return new DeleteSavedPostApplicationException(
      `Post with ID ${postId} cannot be deleted from the user with ID ${userId} saved posts list`,
      this.cannotDeletePostFromSavedPostsId
    )
  }

  public static userNotFound (userId: User['id']): DeleteSavedPostApplicationException {
    return new DeleteSavedPostApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static postNotFound (postId: Post['id']): DeleteSavedPostApplicationException {
    return new DeleteSavedPostApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }
}
