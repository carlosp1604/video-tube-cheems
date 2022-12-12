import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { User } from '../../Auth/Domain/User'
import { Post } from '../Domain/Post'

export class CreatePostCommentApplicationException extends ApplicationException {
  public static cannotAddCommentId = 'create_post_comment_cannot_add_comment'

  public static cannotAddComment(
    postId: Post['id'],
    userId: User['id']
  ): CreatePostCommentApplicationException {
    return new CreatePostCommentApplicationException(
      `Cannot add comment from user with ID ${userId} to post with ID ${postId}`,
      this.cannotAddCommentId
    )
  }
}