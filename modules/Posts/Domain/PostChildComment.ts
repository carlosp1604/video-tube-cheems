import { DateTime } from 'luxon'
import { User } from '../../Auth/Domain/User'
import { PostCommentDomainException } from './PostCommentDomainException'

export class PostChildComment {
  public readonly id: string
  public comment: string
  public readonly userId: string
  public readonly parentCommentId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public _user: User | null = null

  public constructor(
    id: string,
    comment: string,
    postId: string,
    userId: string,
    parentCommentId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.comment = comment
    this.userId = userId
    this.parentCommentId = parentCommentId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public setUser(user: User): void {
    if (this._user !== null) {
      throw PostCommentDomainException.userAlreadySet(this.id)
    }

    this._user = user
  }

  public setComment(comment: PostChildComment['comment']): void {
    this.comment = comment
  }

  get user(): User {
    if (this._user === null) {
      throw PostCommentDomainException.userIsNotSet(this.id)
    }

    return this._user
  }

  public setUpdatedAt(value: PostChildComment['updatedAt']) {
    this.updatedAt = value
  }
}