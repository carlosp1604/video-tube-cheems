import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export class ChangeUserPasswordApplicationException extends ApplicationException {
  public static userNotFoundId = 'change_user_password_user_not_found'
  public static verificationTokenNotFoundId = 'change_user_password_verification_token_not_found'
  public static invalidPasswordId = 'change_user_password_invalid_password'
  public static cannotUpdateUserId = 'change_user_password_cannot_update_user'
  public static verificationTokenIsNotValidId = 'change_user_password_verification_token_is_not_valid'
  public static tokenDoesNotMatchId = 'change_user_password_token_does_not_match'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, ChangeUserPasswordApplicationException.prototype)
  }

  public static userNotFound (userEmail: User['email']): ChangeUserPasswordApplicationException {
    return new ChangeUserPasswordApplicationException(
      `User with email ${userEmail} was not found`,
      this.userNotFoundId
    )
  }

  public static verificationTokenNotFound (userEmail: User['email']): ChangeUserPasswordApplicationException {
    return new ChangeUserPasswordApplicationException(
      `Verification token associated to user with email ${userEmail} was not found`,
      this.verificationTokenNotFoundId
    )
  }

  public static invalidPassword (password: User['password']): ChangeUserPasswordApplicationException {
    return new ChangeUserPasswordApplicationException(
      `Invalid password: ${password}`,
      this.invalidPasswordId
    )
  }

  public static cannotUpdateUser (userEmail: User['email']): ChangeUserPasswordApplicationException {
    return new ChangeUserPasswordApplicationException(
      `Could not updated password for user with email ${userEmail}`,
      this.cannotUpdateUserId
    )
  }

  public static verificationTokenIsNotValid (userEmail: User['email']): ChangeUserPasswordApplicationException {
    return new ChangeUserPasswordApplicationException(
      `Verification token associated to email ${userEmail} is not valid.`,
      this.verificationTokenIsNotValidId
    )
  }

  public static tokenDoesNotMatch (userEmail: VerificationToken['userEmail']): ChangeUserPasswordApplicationException {
    return new ChangeUserPasswordApplicationException(
      `Token does not match for user with email ${userEmail}`,
      this.tokenDoesNotMatchId
    )
  }
}
