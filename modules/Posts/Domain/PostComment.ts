import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { User } from '../../Auth/Domain/User'
import { PostChildComment } from './PostChildComment'
import { PostCommentDomainException } from './PostCommentDomainException'

export class PostComment {
  public readonly id: string
  public comment: string
  public readonly postId: string
  public readonly userId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public _user: User | null = null
  private _childComments: Map<PostChildComment['id'], PostChildComment> =
    new Map<PostChildComment['id'], PostChildComment>()

  public constructor(
    id: string,
    comment: string,
    postId: string,
    userId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.comment = comment
    this.userId = userId
    this.postId = postId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public addChildComment(
    comment: PostChildComment['comment'],
    userId: PostChildComment['userId']
  ): PostChildComment {
    const newChildComment = this.buildChildComment(comment, userId)

    this._childComments.set(newChildComment.id, newChildComment)

    return newChildComment
  }

  public deleteChildComment(childCommentId: PostChildComment['id']): void {
    const childRemoved = this._childComments.delete(childCommentId)

    if (!childRemoved) {
      throw PostCommentDomainException.childCommentNotFound(this.id, childCommentId)
    }
  }

  public updateChild(
    postCommentId: PostComment['id'],
    comment: PostComment['comment']
  ): PostChildComment {
    // TODO: Fix this method
    const childComment = this._childComments.get(postCommentId)

    if (!childComment) {
      throw PostCommentDomainException.childCommentNotFound(this.id, postCommentId)
    }

    childComment.setComment(comment)
    childComment.setUpdatedAt(DateTime.now())
    this._childComments.set(postCommentId, childComment)
    return childComment
  }


  public setUser(user: User): void {
    if (this._user !== null) {
      throw PostCommentDomainException.userAlreadySet(this.id)
    }

    this._user = user
  }

  public setComment(comment: PostComment['comment']): void {
    this.comment = comment
  }

  get user(): User {
    if (this._user === null) {
      throw PostCommentDomainException.userIsNotSet(this.id)
    }

    return this._user
  }

  get childComments(): PostChildComment[] {
    return Array.from(this._childComments.values())
  }

  public setUpdatedAt(value: PostComment['updatedAt']) {
    this.updatedAt = value
  }

  private buildChildComment(
    comment: PostComment['comment'],
    userId: PostComment['userId'],
  ): PostChildComment {
    const nowDate = DateTime.now()
    return new PostChildComment(
      randomUUID(),
      comment,
      userId,
      this.id,
      nowDate,
      nowDate,
      null
    )
  }
}