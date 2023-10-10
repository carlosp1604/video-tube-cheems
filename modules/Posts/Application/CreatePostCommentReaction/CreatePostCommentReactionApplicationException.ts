import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'

export class CreatePostCommentReactionApplicationException extends ApplicationException {
  public static cannotAddReactionId = 'create_post_comment_reaction_cannot_add_reaction'
  public static userAlreadyReactedId = 'create_post_comment_reaction_user_already_reacted'
  public static postCommentNotFoundId = 'create_post_comment_reaction_post_not_found'
  public static userNotFoundId = 'create_post_comment_reaction_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreatePostCommentReactionApplicationException.prototype)
  }

  public static postCommentNotFound (
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): CreatePostCommentReactionApplicationException {
    return new CreatePostCommentReactionApplicationException(
      `Post comment with ID ${postCommentId} was not found`,
      this.postCommentNotFoundId
    )
  }

  public static userNotFound (
    userId: PostComment['userId'] | PostChildComment['userId']
  ): CreatePostCommentReactionApplicationException {
    return new CreatePostCommentReactionApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static userAlreadyReacted (
    userId: PostComment['userId'] | PostChildComment['userId'],
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): CreatePostCommentReactionApplicationException {
    return new CreatePostCommentReactionApplicationException(
      `User with ID ${userId} already reacted to post comment with ID ${postCommentId}`,
      this.userAlreadyReactedId
    )
  }

  public static cannotAddReaction (
    userId: PostComment['userId'] | PostChildComment['userId'],
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): CreatePostCommentReactionApplicationException {
    return new CreatePostCommentReactionApplicationException(
      `Cannot add reaction from user with ID ${userId} to post with ID ${postCommentId}`,
      this.cannotAddReactionId
    )
  }
}
