import { DateTime } from 'luxon'

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly imageUrl: string | null
  public viewsCount: number
  public language: string
  public emailVerified: DateTime | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor(
    id: string,
    name: string,
    email: string,
    imageUrl: string | null,
    viewsCount: number,
    language: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    emailVerified: DateTime | null,
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.imageUrl = imageUrl
    this.viewsCount = viewsCount
    this.language = language
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.emailVerified = emailVerified
  }
}