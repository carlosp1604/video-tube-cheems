import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class DeletePostReactionApplicationException extends ApplicationException {
  public static postNotFoundId = 'delete_reaction_comment_post_not_found'
  public static userNotFoundId = 'delete_reaction_comment_user_not_found'
  public static userHasNotReactedId = 'delete_reaction_user_has_not_reacted'

  public static postNotFound (postId: Post['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static userHasNotReacted (userId: User['id'], postId: Post['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `User with ID ${userId} has not reacted to post with ID ${postId}`,
      this.userHasNotReactedId
    )
  }
}
