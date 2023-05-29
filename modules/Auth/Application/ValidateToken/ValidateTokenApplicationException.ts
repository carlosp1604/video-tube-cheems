import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export class ValidateTokenApplicationException extends ApplicationException {
  public static verificationTokenNotFoundId = 'validate_token_verification_token_not_found'
  public static verificationTokenExpiredId = 'validate_token_verification_token_expired'
  public static cannotUseVerifyEmailTokenId = 'validate_token_cannot_use_verification_token'
  public static cannotUseRecoverPasswordTokenId = 'validate_token_cannot_use_recover_password'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, ValidateTokenApplicationException.prototype)
  }

  public static verificationTokenNotFound (
    userEmail: VerificationToken['userEmail']
  ): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token for user with email ${userEmail} was not found`,
      this.verificationTokenNotFoundId
    )
  }

  public static verificationTokenExpired (
    userEmail: VerificationToken['userEmail']
  ): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token for user with email ${userEmail} has already expired`,
      this.verificationTokenExpiredId
    )
  }

  public static cannotUseVerifyEmailToken (
    userEmail: VerificationToken['userEmail']
  ): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token is intended to created a new user but an user with email ${userEmail} was found`,
      this.cannotUseVerifyEmailTokenId
    )
  }

  public static cannotUseRecoverPasswordToken (
    userEmail: VerificationToken['userEmail']
  ): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token is intended to recover the password from user with email ${userEmail} but it was not found`,
      this.cannotUseRecoverPasswordTokenId
    )
  }
}
