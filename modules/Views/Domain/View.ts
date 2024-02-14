import { DateTime } from 'luxon'

export class View {
  public readonly id: string
  public readonly viewableId: string
  public readonly viewableType: string
  public readonly userId: string | null
  public readonly createdAt: DateTime

  public constructor (
    id: string,
    viewableId: string,
    viewableType: string,
    userId: string | null,
    createdAt: DateTime
  ) {
    this.id = id
    this.viewableId = viewableId
    this.viewableType = viewableType
    this.userId = userId
    this.createdAt = createdAt
  }
}
