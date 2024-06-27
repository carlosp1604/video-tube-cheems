import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class LoginApplicationException extends ApplicationException {
  public static userNotFoundId = 'login_user_not_found'
  public static userPasswordDoesNotMatchId = 'login_user_password_does_not_match'
  public static userAccountNotActiveId = 'login_user_account_not_active'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, LoginApplicationException.prototype)
  }

  public static userNotFound (userEmail: User['email']): LoginApplicationException {
    return new ApplicationException(
      `User with email ${userEmail} was not found`,
      this.userNotFoundId
    )
  }

  public static userPasswordDoesNotMatch (userEmail: User['email']): LoginApplicationException {
    return new ApplicationException(
      `Provided password does not match for user with email ${userEmail}`,
      this.userPasswordDoesNotMatchId
    )
  }

  public static userAccountNotActive (userEmail: User['email']): LoginApplicationException {
    return new ApplicationException(
      `User account from user with email ${userEmail} is not active`,
      this.userAccountNotActiveId
    )
  }
}
