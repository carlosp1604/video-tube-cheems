import { DateTime } from 'luxon'

export class Report {
  public readonly postId: string
  public readonly type: string
  public readonly userId: string
  public readonly content: string
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime

  public constructor (
    postId: string,
    type: string,
    userId: string,
    content: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ) {
    this.postId = postId
    this.type = type
    this.userId = userId
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
