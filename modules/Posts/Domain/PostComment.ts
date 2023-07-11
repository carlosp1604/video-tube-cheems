import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { User } from '~/modules/Auth/Domain/User'
import { PostChildComment } from './PostChildComment'
import { PostCommentDomainException } from './PostCommentDomainException'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'

export class PostComment {
  public readonly id: string
  public comment: string
  public readonly postId: string
  public readonly userId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  /** Relationships **/
  public _user: Relationship<User>
  private _childComments: Collection<PostChildComment, PostChildComment['id']>

  public constructor (
    id: string,
    comment: string,
    postId: string,
    userId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    user: Relationship<User> = Relationship.notLoaded(),
    childComments: Collection<PostChildComment, PostChildComment['id']> = Collection.notLoaded()
  ) {
    this.id = id
    this.comment = comment
    this.userId = userId
    this.postId = postId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this._user = user
    this._childComments = childComments
  }

  public addChildComment (
    comment: PostChildComment['comment'],
    user: User
  ): PostChildComment {
    const newChildComment = this.buildChildComment(comment, user)

    this._childComments.addItem(newChildComment, newChildComment.id)

    return newChildComment
  }

  public updateChild (
    postCommentId: PostComment['id'],
    comment: PostComment['comment']
  ): PostChildComment {
    // TODO: Fix this method
    const childComment = this._childComments.getItem(postCommentId)

    if (!childComment) {
      throw PostCommentDomainException.childCommentNotFound(postCommentId)
    }

    childComment.setComment(comment)
    childComment.setUpdatedAt(DateTime.now())
    this._childComments.addItem(childComment, postCommentId)

    return childComment
  }

  public setComment (comment: PostComment['comment']): void {
    this.comment = comment
  }

  get user (): User {
    if (!this._user.value) {
      // Not loaded o algo así ?¿?¿
      throw PostCommentDomainException.userIsNotSet(this.id)
    }

    return this._user.value
  }

  public getChildComment (postChildCommentId: PostChildComment['id']): PostChildComment | null {
    return this._childComments.getItem(postChildCommentId)
  }

  public removeChildComment (
    postChildCommentId: PostChildComment['id'],
    userId: PostChildComment['userId']
  ): void {
    const childCommentToDelete = this._childComments.getItem(postChildCommentId)

    if (childCommentToDelete === null) {
      throw PostCommentDomainException.childCommentNotFound(postChildCommentId)
    }

    if (childCommentToDelete.userId !== userId) {
      throw PostCommentDomainException.userCannotDeleteChildComment(userId, postChildCommentId)
    }

    const commentRemoved = this._childComments.removeItem(postChildCommentId)

    if (!commentRemoved) {
      throw PostCommentDomainException.cannotDeleteChildComment(postChildCommentId)
    }
  }

  get childComments (): PostChildComment[] {
    return this._childComments.values
  }

  public setUpdatedAt (value: PostComment['updatedAt']) {
    this.updatedAt = value
  }

  private buildChildComment (
    comment: PostComment['comment'],
    user: User
  ): PostChildComment {
    const nowDate = DateTime.now()

    return new PostChildComment(
      randomUUID(),
      comment,
      user.id,
      this.id,
      nowDate,
      nowDate,
      null,
      Relationship.initializeRelation(user)
    )
  }
}
