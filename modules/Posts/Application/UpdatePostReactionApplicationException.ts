import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { User } from '../../Auth/Domain/User'
import { Post } from '../Domain/Post'

export class UpdatePostReactionApplicationException extends ApplicationException {
  public static userHasNotReactedId = 'create_reaction_user_has_not_reacted'
  public static postNotFoundId = 'create_reaction_comment_post_not_found'
  public static userNotFoundId = 'create_reaction_comment_user_not_found'
  public static cannotUpdateReactionId = 'create_reaction_cannot_add_reaction'

  public static postNotFound(postId: Post['id']): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound(userId: User['id']): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static userHasNotReacted(userId: User['id'], postId: Post['id']): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `User with ID ${userId} has not reacted to post with ID ${postId}`,
      this.userHasNotReactedId
    )
  }

  public static cannotUpdateReaction(userId: User['id'], postId: Post['id']): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `Cannot add reaction from user with ID ${userId} to post with ID ${postId}`,
      this.cannotUpdateReactionId
    )
  }
}