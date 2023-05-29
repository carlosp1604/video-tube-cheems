import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class RecoverPasswordApplicationException extends ApplicationException {
  public static userNotFoundId = 'recover_password_user_not_found'
  public static existingTokenActiveId = 'recover_password_token_active'
  public static cannotSendVerificationTokenEmailId = 'recover_password_cannot_send_verification_token_email'
  public static cannotCreateVerificationTokenId = 'recover_password_cannot_create_verification_token'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, RecoverPasswordApplicationException.prototype)
  }

  public static userNotFound (userEmail: User['email']): RecoverPasswordApplicationException {
    return new RecoverPasswordApplicationException(
      `User with email ${userEmail} was not found`,
      this.userNotFoundId
    )
  }

  public static existingTokenActive (userEmail: User['email']): RecoverPasswordApplicationException {
    return new RecoverPasswordApplicationException(
      `A recover-password token already exists for user with email ${userEmail} and its active`,
      this.existingTokenActiveId
    )
  }

  public static cannotSendVerificationTokenEmail (userEmail: User['email']): RecoverPasswordApplicationException {
    return new RecoverPasswordApplicationException(
      `Verify token for user with email ${userEmail} could not be sent`,
      this.cannotSendVerificationTokenEmailId
    )
  }

  public static cannotCreateVerificationToken (userEmail: User['email']): RecoverPasswordApplicationException {
    return new RecoverPasswordApplicationException(
      `Verify token for user with email ${userEmail} could not be created`,
      this.cannotCreateVerificationTokenId
    )
  }
}
