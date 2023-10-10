import { DateTime } from 'luxon'
import { User } from '~/modules/Auth/Domain/User'
import { PostCommentDomainException } from './PostCommentDomainException'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'

export class PostChildComment extends ReactionableModel {
  public readonly id: string
  public comment: string
  public readonly userId: string
  public readonly parentCommentId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  /** Relationships **/
  public _user: Relationship<User>

  public constructor (
    id: string,
    comment: string,
    userId: string,
    parentCommentId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    user: Relationship<User> = Relationship.notLoaded(),
    reactions: Collection<Reaction, Reaction['userId']> = Collection.notLoaded()
  ) {
    super()
    this.id = id
    this.comment = comment
    this.userId = userId
    this.parentCommentId = parentCommentId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this._user = user
    this.modelReactions = reactions
  }

  public setComment (comment: PostChildComment['comment']): void {
    this.comment = comment
  }

  get user (): User {
    if (!this._user.value) {
      throw PostCommentDomainException.userIsNotSet(this.id)
    }

    return this._user.value
  }

  public setUpdatedAt (value: PostChildComment['updatedAt']) {
    this.updatedAt = value
  }

  public addReaction (userId: Reaction['userId'], reactionType: string): Reaction {
    return super.addReaction(this.id, ReactionableType.POST_COMMENT, userId, reactionType)
  }

  public deleteReaction (userId: Reaction['userId']) {
    super.deleteReaction(this.id, ReactionableType.POST_COMMENT, userId)
  }
}
