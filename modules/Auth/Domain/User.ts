import { DateTime } from 'luxon'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { container } from '~/awailix.container'

export class User {
  public readonly id: string
  public readonly name: string
  public readonly username: string
  public readonly email: string
  public readonly imageUrl: string | null
  public language: string
  public password: string
  public emailVerified: DateTime | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

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
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.username = username
    this.imageUrl = imageUrl
    this.password = hashedPassword
    this.language = language
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.emailVerified = emailVerified
  }

  public async matchPasswords (password: string) {
    const cryptoService = container.resolve<CryptoServiceInterface>('cryptoService')

    return cryptoService.compare(password, this.password)
  }

  public isAccountActive (): boolean {
    return this.emailVerified !== null
  }
}
