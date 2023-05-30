import { DomainException } from '~/modules/Exceptions/Domain/DomainException'

export class VerificationTokenDomainException extends DomainException {
  public static invalidVerificationTokenTypeId = 'verification_token_domain_invalid_verification_token_type'

  public static invalidVerificationTokenType (value: string): VerificationTokenDomainException {
    return new VerificationTokenDomainException(
      `Invalid verification token type: ${value}`,
      this.invalidVerificationTokenTypeId
    )
  }
}