import { DateTime } from 'luxon'
import { EmailValidator } from '~/modules/Shared/Domain/EmailValidator'
import { VerificationTokenDomainException } from '~/modules/Auth/Domain/VerificationTokenDomainException'

export enum VerificationTokenType {
  VERIFY_EMAIL = 'verify-email',
  RECOVER_PASSWORD = 'recover-password'
}

export class VerificationToken {
  public readonly id: string
  public readonly token: string
  public readonly userEmail: string
  public readonly type: VerificationTokenType
  public readonly expiresAt: DateTime
  public readonly createdAt: DateTime

  constructor (
    id: string,
    token: string,
    userEmail: string,
    type: string,
    expiresAt: DateTime,
    createdAt: DateTime
  ) {
    this.id = id
    this.token = token
    this.userEmail = (new EmailValidator()).validate(userEmail)
    this.type = VerificationToken.validateVerificationTokenType(type)
    this.expiresAt = expiresAt
    this.createdAt = createdAt
  }

  private static validateVerificationTokenType (value: string): VerificationTokenType {
    const values: string [] = Object.values(VerificationTokenType)

    if (!values.includes(value)) {
      throw VerificationTokenDomainException.invalidVerificationTokenType(value)
    }

    return value as VerificationTokenType
  }

  public tokenHasExpired (): boolean {
    return this.expiresAt < DateTime.now()
  }
}
