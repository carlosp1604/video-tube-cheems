import { DateTime } from 'luxon'
import { PostReactionDomainException } from './PostReactionDomainException'

export enum Reaction {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export class PostReaction {
  public readonly postId: string
  public readonly userId: string
  private _reactionType: Reaction
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
    PostReaction.validateReaction(reactionType)
    this.postId = postId
    this.userId = userId
    this._reactionType = reactionType
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  private static validateReaction(reactionType: Reaction): void {
    for (const validReaction in Reaction) {
      if (validReaction === reactionType) {
        return
      }
    }

    throw PostReactionDomainException.invalidReactionType(reactionType)
  }

  set reactionType(value: Reaction) {
    this._reactionType = value
  }
}