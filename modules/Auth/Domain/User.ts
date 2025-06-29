import { DateTime } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { EmailValidator } from '~/modules/Shared/Domain/EmailValidator'
import { UsernameValidator } from '~/modules/Shared/Domain/UsernameValidator'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Post } from '~/modules/Posts/Domain/Post'
import { Account } from '~/modules/Auth/Domain/Account'
import { container } from '~/awilix.container'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { PasswordValidator } from '~/modules/Shared/Domain/PasswordValidator'

export class User {
  public readonly id: string
  public readonly name: string
  public readonly username: string
  public readonly email: string
  public readonly imageUrl: string | null
  public language: string
  private _password: string | null
  public emailVerified: DateTime | null
  public readonly createdAt: DateTime
  public _updatedAt: DateTime
  public deletedAt: DateTime | null

  /** Relationships **/
  public _verificationToken: Relationship<VerificationToken | null>
  public _savedPosts: Collection<Post, Post['id']>
  public _accounts: Collection<Account, string>

  public constructor (
    id: string,
    name: string,
    username: string,
    email: string,
    imageUrl: string | null,
    language: string,
    hashedPassword: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    emailVerified: DateTime | null,
    deletedAt: DateTime | null,
    verificationTokenRelationship: Relationship<VerificationToken | null> = Relationship.notLoaded(),
    savedPosts: Collection<Post, Post['id']> = Collection.notLoaded(),
    accounts: Collection<Account, string> = Collection.notLoaded()
  ) {
    this.id = id
    this.name = name
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
    this._savedPosts = savedPosts
    this._accounts = accounts
  }

  public async matchPasswords (password: string) {
    if (!this._password) {
      return false
    }

    const cryptoService = container.resolve<CryptoServiceInterface>('cryptoService')

    return cryptoService.compare(password, this._password)
  }

  public isAccountActive (): boolean {
    return this.emailVerified !== null
  }

  public setVerificationToken (type: VerificationTokenType, renovateToken: boolean): VerificationToken {
    if (type === VerificationTokenType.CREATE_ACCOUNT) {
      throw UserDomainException.cannotAddVerificationTokenToAccountCreation(this.id)
    }

    const verificationTokenToAdd = this.buildVerificationToken(type)

    const verificationToken = this.verificationToken

    if (this.verificationToken !== null) {
      if (!this.verificationToken.tokenHasExpired() && !renovateToken) {
        throw UserDomainException.userHasAlreadyAnActiveToken(this.id)
      }

      return verificationTokenToAdd
    }

    this._verificationToken.updateRelationship(verificationToken)

    return verificationTokenToAdd
  }

  public removeVerificationToken (): void {
    try {
      this._verificationToken.removeRelationship()
    } catch (exception: unknown) {
      if (!(exception instanceof RelationshipDomainException)) {
        throw exception
      }

      if (exception.id === RelationshipDomainException.cannotDeleteRelationId) {
        throw UserDomainException.cannotRemoveVerificationToken(this.id)
      }

      throw exception
    }
  }

  public addSavedPost (post: Post): void {
    const existingSavedPost = this._savedPosts.getItem(post.id)

    if (existingSavedPost !== null) {
      throw UserDomainException.postAlreadySaved(post.id)
    }

    this._savedPosts.addItem(post, post.id)
  }

  public removeSavedPost (postId: Post['id']): void {
    const existingSavedPost = this._savedPosts.getItem(postId)

    if (existingSavedPost === null) {
      throw UserDomainException.postDoesNotExistOnSavedPosts(postId)
    }

    const removedItem = this._savedPosts.removeItem(postId)

    if (!removedItem) {
      throw UserDomainException.cannotDeletePostFromSavedPosts(postId)
    }
  }

  get verificationToken (): VerificationToken | null {
    return this._verificationToken.value
  }

  get savedPosts (): Array<Post> {
    return this._savedPosts.values
  }

  get accounts (): Array<Account> {
    return this._accounts.values
  }

  get password (): string | null {
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

  public async changeUserPassword (password: User['password'] & string): Promise<void> {
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
      cryptoService.randomNumericCode(),
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
        cryptoService.randomNumericCode(),
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
