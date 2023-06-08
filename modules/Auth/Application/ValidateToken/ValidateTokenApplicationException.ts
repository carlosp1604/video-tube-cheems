import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export class ValidateTokenApplicationException extends ApplicationException {
  public static verificationTokenNotFoundId = 'validate_token_verification_token_not_found'
  public static cannotUseCreateAccountTokenId = 'validate_token_cannot_use_create_account_token'
  public static cannotUseRecoverPasswordTokenId = 'validate_token_cannot_use_recover_password_token'
  public static tokenDoesNotMatchId = 'validate_token_token_does_not_match'

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

  public static cannotUseCreateAccountToken (
    userEmail: VerificationToken['userEmail']
  ): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token is intended to create a new user but an user with email ${userEmail} already exists`,
      this.cannotUseCreateAccountTokenId
    )
  }

  public static cannotUseRecoverPasswordToken (
    userEmail: VerificationToken['userEmail']
  ): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token is intended to recover the password from user with email ${userEmail} but user does not exist`,
      this.cannotUseRecoverPasswordTokenId
    )
  }

  public static tokenDoesNotMatch (userEmail: VerificationToken['userEmail']): ValidateTokenApplicationException {
    return new ValidateTokenApplicationException(
      `Token does not match for user with email ${userEmail}`,
      this.tokenDoesNotMatchId
    )
  }
}
