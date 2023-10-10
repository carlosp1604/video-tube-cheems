import { DateTime } from 'luxon'
import { ReactionDomainException } from './ReactionDomainException'

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export enum ReactionableType {
  POST = 'Post',
  POST_COMMENT = 'PostComment'
}

export class Reaction {
  public readonly reactionableId: string
  public readonly reactionableType: ReactionableType
  public readonly userId: string
  private _reactionType: ReactionType
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor (
    reactionableId: string,
    reactionableType: string,
    userId: string,
    reactionType: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt:DateTime | null
  ) {
    this.reactionableType = Reaction.validateReactionableType(reactionableType)
    this.reactionableId = reactionableId
    this.userId = userId
    this._reactionType = Reaction.validateReactionType(reactionType)
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  private static validateReactionType (reactionType: string): ReactionType {
    for (const validReaction of Object.values(ReactionType)) {
      if (validReaction === reactionType) {
        return validReaction
      }
    }

    throw ReactionDomainException.invalidReactionType(reactionType)
  }

  private static validateReactionableType (reactionableType: string): ReactionableType {
    for (const validReactionableType of Object.values(ReactionableType)) {
      if (validReactionableType === reactionableType) {
        return validReactionableType
      }
    }

    throw ReactionDomainException.invalidReactionableType(reactionableType)
  }

  get reactionType (): ReactionType {
    return this._reactionType
  }

  public updateReactionType (reactionType: string) {
    this._reactionType = Reaction.validateReactionType(reactionType)
  }

  public setReactionType (reactionType: ReactionType) {
    Reaction.validateReactionType(reactionType)
    this._reactionType = reactionType
  }

  public setUpdatedAt (updatedAt: DateTime) {
    this.updatedAt = updatedAt
  }

  public isSameReactionType (reactionType: string) {
    return this._reactionType === reactionType
  }
}
