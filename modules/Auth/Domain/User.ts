import crypto from 'crypto'
import { DateTime } from 'luxon'
import { container } from '~/awailix.container'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { EmailValidator } from '~/modules/Shared/Domain/EmailValidator'
import { UsernameValidator } from '~/modules/Shared/Domain/UsernameValidator'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'
import { PasswordValidator } from '~/modules/Shared/Domain/PasswordValidator'
import { NameValidator } from '~/modules/Shared/Domain/NameValidator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class User {
  public readonly id: string
  public readonly name: string
  public readonly username: string
  public readonly email: string
  public readonly imageUrl: string | null
  public language: string
  private _password: string
  public emailVerified: DateTime | null
  public readonly createdAt: DateTime
  public _updatedAt: DateTime
  public deletedAt: DateTime | null

  /** Relationships **/
  public _verificationToken: Relationship<VerificationToken | null>

  public constructor (
    id: string,
    name: string,
    username: string,
    email: string,
    imageUrl: string | null,
    language: string,
    hashedPassword: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    emailVerified: DateTime | null,
    deletedAt: DateTime | null,
    verificationTokenRelationship: Relationship<VerificationToken | null> = Relationship.notLoaded()
  ) {
    this.id = id
    this.name = (new NameValidator()).validate(name)
    this.email = (new EmailValidator()).validate(email)
    this.username = (new UsernameValidator()).validate(username)
    this.imageUrl = imageUrl
    this._password = hashedPassword
    this.language = language
    this.createdAt = createdAt
    this._updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.emailVerified = emailVerified
    this._verificationToken = verificationTokenRelationship
  }

  public async matchPasswords (password: string) {
    const cryptoService = container.resolve<CryptoServiceInterface>('cryptoService')

    return cryptoService.compare(password, this.password)
  }

  public isAccountActive (): boolean {
    return this.emailVerified !== null
  }

  public setVerificationToken (type: VerificationTokenType, renovateToken: boolean): VerificationToken {
    if (type === VerificationTokenType.CREATE_ACCOUNT) {
      throw UserDomainException.cannotAddVerificationTokenToAccountCreation(this.id)
    }

    const verificationTokenToAdd = this.buildVerificationToken(type)

    try {
      const verificationToken = this.verificationToken

      if (this.verificationToken !== null) {
        if (!this.verificationToken.tokenHasExpired() && !renovateToken) {
          throw UserDomainException.userHasAlreadyAnActiveToken(this.id)
        }

        const relationshipUpdated = this._verificationToken.updateRelationship(verificationToken)

        if (!relationshipUpdated) {
          throw UserDomainException.cannotAddVerificationToken(this.id)
        }

        return verificationTokenToAdd
      }
    } catch (exception: unknown) {
      if (!(exception instanceof RelationshipDomainException)) {
        throw exception
      }
    }

    this._verificationToken = Relationship.createRelation(verificationTokenToAdd)

    return verificationTokenToAdd
  }

  public removeVerificationToken (): void {
    const removed = this._verificationToken.removeRelationship()

    if (!removed) {
      throw UserDomainException.cannotRemoveVerificationToken(this.id)
    }
  }

  get verificationToken (): VerificationToken | null {
    return this._verificationToken.value ?? null
  }

  get password (): string {
    return this._password
  }

  get updatedAt (): DateTime {
    return this._updatedAt
  }

  public assertVerificationTokenIsValidFor (type: VerificationTokenType, tokenValue: VerificationToken['token']): void {
    if (this.verificationToken === null) {
      throw UserDomainException.userHasNotAVerificationToken(this.id)
    }

    if (!this.verificationToken.isTokenValidFor(type)) {
      throw UserDomainException.verificationTokenIsNotValidFor(this.verificationToken.id, type)
    }

    if (!this.verificationToken.valueMatches(tokenValue)) {
      throw UserDomainException.tokenDoesNotMatch(tokenValue)
    }
  }

  public async changeUserPassword (password: User['password']): Promise<void> {
    const cryptoService = container.resolve<CryptoServiceInterface>('cryptoService')

    const validatedPassword = (new PasswordValidator()).validate(password)

    this._password = await cryptoService.hash(validatedPassword)
    this._updatedAt = DateTime.now()
  }

  private buildVerificationToken (type: VerificationTokenType): VerificationToken {
    const cryptoService = container.resolve<CryptoServiceInterface>('cryptoService')

    const nowDate = DateTime.now()

    return new VerificationToken(
      crypto.randomUUID(),
      cryptoService.randomString(),
      this.email,
      type,
      nowDate.plus({ minute: 30 }),
      nowDate
    )
  }

  public static buildVerificationTokenForAccountCreation (email: User['email']): VerificationToken {
    const cryptoService = container.resolve<CryptoServiceInterface>('cryptoService')

    const nowDate = DateTime.now()

    try {
      return new VerificationToken(
        crypto.randomUUID(),
        cryptoService.randomString(),
        email,
        VerificationTokenType.CREATE_ACCOUNT,
        nowDate.plus({ minute: 30 }),
        nowDate
      )
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidEmailId) {
        throw UserDomainException.cannotCreateVerificationToken(email)
      }

      throw exception
    }
  }
}
