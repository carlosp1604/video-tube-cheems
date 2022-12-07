import { DateTime } from 'luxon'

export class PostMeta {
  public readonly type: string
  public readonly value: string
  public readonly postId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor(
    type: string,
    value: string,
    postId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null
  ) {
    this.type = type
    this.value = value
    this.postId = postId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}