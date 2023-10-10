import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { DateTime } from 'luxon'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'

export abstract class ReactionableModel {
  private _reactions: Collection<Reaction, Reaction['userId']> = Collection.notLoaded()

  get reactions (): Reaction[] {
    return this._reactions.values
  }

  get modelReactions (): Collection<Reaction, Reaction['userId']> {
    return this._reactions
  }

  set modelReactions (reactions: Collection<Reaction, Reaction['userId']>) {
    this._reactions = reactions
  }

  public addReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userId: Reaction['userId'],
    reactionType: string
  ): Reaction {
    const existingReaction = this._reactions.getItem(userId)

    // If reaction already exists and is the same type then throw exception
    // If reaction already exists and is the same type then we update it
    if (existingReaction) {
      if (existingReaction.isSameReactionType(reactionType)) {
        throw ReactionableModelDomainException.userAlreadyReacted(userId, reactionableId, reactionableType)
      } else {
        existingReaction.updateReactionType(reactionType)
        existingReaction.setUpdatedAt(DateTime.now())

        return existingReaction
      }
    }

    try {
      const postReaction = this.buildReaction(reactionableId, reactionableType, userId, reactionType)

      this._reactions.addItem(postReaction, postReaction.userId)

      return postReaction
    } catch (exception: unknown) {
      throw ReactionableModelDomainException.cannotAddReaction(userId, reactionableId, reactionableType)
    }
  }

  public updateReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userId: Reaction['userId'],
    reactionType: Reaction['reactionType']
  ): Reaction {
    const existingReaction = this._reactions.getItem(userId)

    if (!existingReaction) {
      throw ReactionableModelDomainException.userHasNotReacted(userId, reactionableId, reactionableType)
    }

    if (existingReaction.reactionType === reactionType) {
      return existingReaction
    }

    try {
      existingReaction.setReactionType(reactionType)
      existingReaction.setUpdatedAt(DateTime.now())
    } catch (exception: unknown) {
      throw ReactionableModelDomainException.cannotUpdateReaction(userId, reactionableId, reactionableType)
    }

    this._reactions.addItem(existingReaction, userId)

    return existingReaction
  }

  public deleteReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userId: Reaction['userId']
  ): void {
    const reactionRemoved = this._reactions.removeItem(userId)

    if (!reactionRemoved) {
      throw ReactionableModelDomainException.userHasNotReacted(userId, reactionableId, reactionableType)
    }
  }

  private buildReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userId: Reaction['userId'],
    reactionType: string
  ): Reaction {
    const nowDate = DateTime.now()

    return new Reaction(
      reactionableId,
      reactionableType,
      userId,
      reactionType,
      nowDate,
      nowDate,
      null
    )
  }
}
