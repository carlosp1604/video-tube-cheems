import { DateTime } from 'luxon'
import { User } from '../../Auth/Domain/User'
import { PostCommentDomainException } from './PostCommentDomainException'

export class PostComment {
  public readonly id: string
  public readonly comment: string
  public readonly postId: string
  public readonly userId: string
  public readonly parentCommentId: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public _user: User | null = null
  private _childComments: Map<PostComment['id'], PostComment> =
    new Map<PostComment['id'], PostComment>()

  public constructor(
    id: string,
    comment: string,
    postId: string,
    userId: string,
    parentCommentId: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.comment = comment
    this.userId = userId
    this.postId = postId
    this.parentCommentId = parentCommentId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public addChildComment(postComment: PostComment): void {
    if (
      postComment.parentCommentId === null ||
      postComment.parentCommentId !== this.id
    ) {
      throw PostCommentDomainException.cannotAddChildComment(this.id, postComment.id)
    }
    this._childComments.set(postComment.id, postComment)
  }

  public setUser(user: User): void {
    if (this._user !== null) {
      throw PostCommentDomainException.userAlreadySet(this.id)
    }

    this._user = user
  }

  get user(): User {
    if (this._user === null) {
      throw PostCommentDomainException.userIsNotSet(this.id)
    }

    return this._user
  }

  get childComments(): PostComment[] {
    return Array.from(this._childComments.values())
  }
}