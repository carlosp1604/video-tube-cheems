import { DateTime } from 'luxon'

export class Actor {
  public readonly id: string
  public readonly slug: string
  public readonly name: string
  public readonly description: string | null
  public readonly imageUrl: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor (
    id: string,
    slug: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.slug = slug
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
