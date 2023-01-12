import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { User } from '../../Auth/Domain/User'
import { Post } from '../Domain/Post'

export class DeletePostReactionApplicationException extends ApplicationException {
  public static cannotDeleteReactionId = 'create_reaction_cannot_delete_reaction'
  public static postNotFoundId = 'create_reaction_comment_post_not_found'
  public static userNotFoundId = 'create_reaction_comment_user_not_found'

  public static postNotFound(postId: Post['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound(userId: User['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static cannotDeleteReaction(userId: User['id'], postId: Post['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `Cannot delete reaction from user with ID ${userId} in post with ID ${postId}`,
      this.cannotDeleteReactionId
    )
  }
}