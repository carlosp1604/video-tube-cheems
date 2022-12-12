import { DateTime } from 'luxon'

export enum Reaction {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export class PostReaction {
  public readonly postId: string
  public readonly userId: string
  public readonly reactionType: Reaction
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor(
    postId: string,
    userId: string,
    reactionType: Reaction,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt:DateTime | null
  ) {
    this.postId = postId
    this.userId = userId
    this.reactionType = reactionType
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}