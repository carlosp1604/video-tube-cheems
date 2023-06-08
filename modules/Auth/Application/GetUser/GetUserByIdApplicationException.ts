import { User } from '~/modules/Auth/Domain/User'
import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetUserByIdApplicationException extends ApplicationException {
  public static userNotFoundId = 'get_user_by_id_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetUserByIdApplicationException.prototype)
  }

  public static userNotFound (userId: User['id']): GetUserByIdApplicationException {
    return new GetUserByIdApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }
}
