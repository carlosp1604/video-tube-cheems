import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { PostComment } from '~/modules/Posts/Domain/PostComment'

export class CreatePostChildCommentApplicationException extends ApplicationException {
  public static cannotAddCommentId = 'create_post_child_comment_cannot_add_comment'
  public static postNotFoundId = 'create_post_child_comment_post_not_found'
  public static userNotFoundId = 'create_post_child_comment_user_not_found'
  public static parentCommentNotFoundId = 'create_post_child_comment_parent_comment_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreatePostChildCommentApplicationException.prototype)
  }

  public static cannotAddChildComment (
    parentCommentId: PostChildComment['parentCommentId'],
    userId: User['id']
  ): CreatePostChildCommentApplicationException {
    return new CreatePostChildCommentApplicationException(
      `Cannot add child comment from user with ID ${userId} to comment with ID ${parentCommentId}`,
      this.cannotAddCommentId
    )
  }

  public static postNotFound (postId: Post['id']): CreatePostChildCommentApplicationException {
    return new CreatePostChildCommentApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): CreatePostChildCommentApplicationException {
    return new CreatePostChildCommentApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static parentCommentNotFound (
    postCommentId: PostComment['id']
  ): CreatePostChildCommentApplicationException {
    return new CreatePostChildCommentApplicationException(
      `PostComment with ID ${postCommentId} was not found`,
      this.userNotFoundId
    )
  }
}
