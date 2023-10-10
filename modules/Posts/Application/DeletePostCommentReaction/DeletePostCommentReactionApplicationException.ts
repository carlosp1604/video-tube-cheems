import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'

export class DeletePostCommentReactionApplicationException extends ApplicationException {
  public static postCommentNotFoundId = 'delete_post_comment_reaction_comment_post_not_found'
  public static userNotFoundId = 'delete_post_comment_reaction_comment_user_not_found'
  public static userHasNotReactedId = 'delete_post_comment_reaction_user_has_not_reacted'

  public static postCommentNotFound (
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): DeletePostCommentReactionApplicationException {
    return new DeletePostCommentReactionApplicationException(
      `Post comment with ID ${postCommentId} was not found`,
      this.postCommentNotFoundId
    )
  }

  public static userNotFound (
    userId: PostComment['userId'] | PostChildComment['userId']
  ): DeletePostCommentReactionApplicationException {
    return new DeletePostCommentReactionApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static userHasNotReacted (
    userId: PostComment['userId'] | PostChildComment['userId'],
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): DeletePostCommentReactionApplicationException {
    return new DeletePostCommentReactionApplicationException(
      `User with ID ${userId} has not reacted to post comment with ID ${postCommentId}`,
      this.userHasNotReactedId
    )
  }
}
