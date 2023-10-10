import { DateTime } from 'luxon'

export class VideoProvider {
  public readonly id: string
  public readonly name: string
  public readonly logoUrl: string
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime

  public constructor (
    id: string,
    name: string,
    logoUrl: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ) {
    this.id = id
    this.name = name
    this.logoUrl = logoUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
