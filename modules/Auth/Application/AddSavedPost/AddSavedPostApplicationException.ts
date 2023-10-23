import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'
import { Post } from '~/modules/Posts/Domain/Post'

export class AddSavedPostApplicationException extends ApplicationException {
  public static postPostAlreadyAddedId = 'add_saved_post_post_already_added'
  public static userNotFoundId = 'add_saved_post_user_not_found'
  public static postNotFoundId = 'add_saved_post_post_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddSavedPostApplicationException.prototype)
  }

  public static postAlreadyAdded (
    userId: User['id'],
    postId: Post['id']
  ): AddSavedPostApplicationException {
    return new AddSavedPostApplicationException(
      `Post with ID ${postId} is already on the user with ID ${userId} saved posts list`,
      this.postPostAlreadyAddedId
    )
  }

  public static userNotFound (userId: User['id']): AddSavedPostApplicationException {
    return new AddSavedPostApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static postNotFound (postId: Post['id']): AddSavedPostApplicationException {
    return new AddSavedPostApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }
}
