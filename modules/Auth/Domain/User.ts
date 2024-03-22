import crypto from 'crypto'
import { DateTime } from 'luxon'
import { container } from '~/awilix.container'
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
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Post } from '~/modules/Posts/Domain/Post'
import {Account} from "~/modules/Auth/Domain/Account";

export class User {
  public readonly id: string
  public readonly name: string
  public readonly username: string
  public readonly email: string | null
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

  public constructor(
    id: string,
    name: string,
    username: string,
    email: string | null,
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
    let validatedEmail: string | null = email

    if (email !== null) {
      validatedEmail = (new EmailValidator()).validate(email)
    }

    this.id = id
    this.name = (new NameValidator()).validate(name)
    this.email = validatedEmail
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

  public async matchPasswords(password: string) {
    throw Error('Not implemented!')
  }

  public isAccountActive(): boolean {
    return this.emailVerified !== null
  }

  public setVerificationToken(type: VerificationTokenType, renovateToken: boolean): VerificationToken {
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

  public removeVerificationToken(): void {
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

  public addSavedPost(post: Post): void {
    const existingSavedPost = this._savedPosts.getItem(post.id)

    if (existingSavedPost !== null) {
      throw UserDomainException.postAlreadySaved(post.id)
    }

    this._savedPosts.addItem(post, post.id)
  }

  public removeSavedPost(postId: Post['id']): void {
    const existingSavedPost = this._savedPosts.getItem(postId)

    if (existingSavedPost === null) {
      throw UserDomainException.postDoesNotExistOnSavedPosts(postId)
    }

    const removedItem = this._savedPosts.removeItem(postId)

    if (!removedItem) {
      throw UserDomainException.cannotDeletePostFromSavedPosts(postId)
    }
  }

  get verificationToken(): VerificationToken | null {
    return this._verificationToken.value
  }

  get savedPosts(): Array<Post> {
    return this._savedPosts.values
  }

  get accounts(): Array<Account> {
    return this._accounts.values
  }

  get password(): string | null {
    return this._password
  }

  get updatedAt(): DateTime {
    return this._updatedAt
  }

  public assertVerificationTokenIsValidFor(type: VerificationTokenType, tokenValue: VerificationToken['token']): void {
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

  public async changeUserPassword(password: User['password']): Promise<void> {
    throw Error('Not implemented!')
  }

  private buildVerificationToken (type: VerificationTokenType): VerificationToken {
    throw Error('Not implemented!')
  }

  public static buildVerificationTokenForAccountCreation(email: User['email']): VerificationToken {
    throw Error('Not implemented!')
  }
}