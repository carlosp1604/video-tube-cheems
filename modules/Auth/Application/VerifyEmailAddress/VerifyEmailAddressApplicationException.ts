import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class VerifyEmailAddressApplicationException extends ApplicationException {
  public static emailAlreadyRegisteredId = 'verify_email_email_already_registered'
  public static existingTokenActiveId = 'verify_email_token_active'
  public static cannotSendVerificationTokenEmailId = 'verify_email_cannot_send_verification_token_email'
  public static cannotCreateVerificationTokenId = 'verify_email_cannot_create_verification_token'
  public static invalidEmailAddressId = 'verify_email_invalid_email_address'
  public static invalidTokenTypeId = 'verify_email_invalid_token_type'
  public static userNotFoundId = 'verify_email_user_not_found'

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
      `Verification token for user with email ${userEmail} could not be sent`,
      this.cannotSendVerificationTokenEmailId
    )
  }

  public static cannotCreateVerificationToken (userEmail: User['email']): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `Verification token for user with email ${userEmail} could not be created`,
      this.cannotCreateVerificationTokenId
    )
  }

  public static invalidTokenType (tokenType: string): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `Requested token type ${tokenType} is not valid`,
      this.invalidTokenTypeId
    )
  }

  public static invalidEmailAddress (emailAddress: string): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `Cannot create verification token due to invalid email address: ${emailAddress}`,
      this.invalidEmailAddressId
    )
  }

  public static userNotFound (userEmail: User['email']): VerifyEmailAddressApplicationException {
    return new VerifyEmailAddressApplicationException(
      `User associated to email ${userEmail} was not found`,
      this.userNotFoundId
    )
  }
}
