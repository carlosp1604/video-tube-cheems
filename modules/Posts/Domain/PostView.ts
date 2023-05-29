import { DateTime } from 'luxon'

export class PostView {
  public readonly id: string
  public readonly userId: string | null
  public readonly postId: string
  public readonly createdAt: DateTime

  public constructor (
    id: string,
    userId: string | null,
    postId: string,
    createdAt: DateTime
  ) {
    this.id = id
    this.userId = userId
    this.postId = postId
    this.createdAt = createdAt
  }
}
