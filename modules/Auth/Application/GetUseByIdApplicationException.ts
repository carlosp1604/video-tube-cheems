import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { User } from '../../Auth/Domain/User'

export class GetUserByIdApplicationException extends ApplicationException {
  public static userNotFoundId = 'get_user_by_id_user_not_found'

  public static userNotFound(userId: User['id']): GetUserByIdApplicationException {
    return new GetUserByIdApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }
}