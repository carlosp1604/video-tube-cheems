import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class CreatePostReactionApplicationException extends ApplicationException {
  public static cannotAddReactionId = 'create_reaction_comment_cannot_add_reaction'
  public static userAlreadyReactedId = 'create_reaction_user_already_reacted'
  public static postNotFoundId = 'create_reaction_comment_post_not_found'
  public static userNotFoundId = 'create_reaction_comment_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreatePostReactionApplicationException.prototype)
  }

  public static postNotFound (postId: Post['id']): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static userAlreadyReacted (userId: User['id'], postId: Post['id']): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `User with ID ${userId} already reacted to post with ID ${postId}`,
      this.userAlreadyReactedId
    )
  }

  public static cannotAddReaction (userId: User['id'], postId: Post['id']): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `Cannot add reaction from user with ID ${userId} to post with ID ${postId}`,
      this.cannotAddReactionId
    )
  }
}
