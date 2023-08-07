import { DateTime } from 'luxon'

export class Translation {
  public readonly translatableId: string
  public readonly translatableType: string
  public readonly field: string
  public readonly value: string
  public readonly language: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime

  public constructor (
    translatableId: string,
    translatableType: string,
    field: string,
    value: string,
    language: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ) {
    this.translatableId = translatableId
    this.translatableType = translatableType
    this.field = field
    this.value = value
    this.language = language
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
