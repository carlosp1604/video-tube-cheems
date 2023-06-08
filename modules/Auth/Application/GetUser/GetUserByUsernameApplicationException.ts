import { User } from '~/modules/Auth/Domain/User'
import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetUserByUsernameApplicationException extends ApplicationException {
  public static userNotFoundId = 'get_user_by_username_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetUserByUsernameApplicationException.prototype)
  }

  public static userNotFound (username: User['username']): GetUserByUsernameApplicationException {
    return new GetUserByUsernameApplicationException(
      `User with username ${username} was not found`,
      this.userNotFoundId
    )
  }
}
