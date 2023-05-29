import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class VerifyEmailAddressApplicationException extends ApplicationException {
  public static emailAlreadyRegisteredId = 'verify_email_email_already_registered'
  public static existingTokenActiveId = 'verify_email_token_active'
  public static cannotSendVerificationTokenEmailId = 'verify_email_cannot_send_verification_token_email'
  public static cannotCreateVerificationTokenId = 'verify_email_cannot_create_verification_token'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, VerifyEmailAddressApplicationException.prototype)
  }

  public static emailAlreadyRegistered (userEmail: User['email']): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `${userEmail} is already registered`,
      this.emailAlreadyRegisteredId
    )
  }

  public static existingTokenActive (userEmail: User['email']): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `Verification token for user with email ${userEmail} was already sent`,
      this.existingTokenActiveId
    )
  }

  public static cannotSendVerificationTokenEmail (userEmail: User['email']): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `Verify token for user with email ${userEmail} could not be sent`,
      this.cannotSendVerificationTokenEmailId
    )
  }

  public static cannotCreateVerificationToken (userEmail: User['email']): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `Verify token for user with email ${userEmail} could not be created`,
      this.cannotCreateVerificationTokenId
    )
  }
}
