import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { Post } from '../Domain/Post'
import { User } from '../../Auth/Domain/User'

export class GetPostByIdApplicationException extends ApplicationException {
  public static postNotFoundId = 'get_post_by_id_post_not_found'
  public static userNotFoundId = 'get_post_by_id_user_not_found'


  public static postNotFound(postId: Post['id']): GetPostByIdApplicationException {
    return new GetPostByIdApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userNotFound(userId: User['id']): GetPostByIdApplicationException {
    return new GetPostByIdApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }
}