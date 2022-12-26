import { PostMeta } from './PostMeta'
import { PostTag } from './PostTag'
import { Actor } from './Actor'
import { DateTime } from 'luxon'
import { PostComment } from './PostComment'
import { PostReaction } from './PostReaction'
import { PostDomainException } from './PostDomainException'
import { PostCommentDomainException } from './PostCommentDomainException'

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly description: string
  public viewsCount: number
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public publishedAt: DateTime | null
  private _meta: Map<string, PostMeta> = new Map<string, PostMeta>()
  private _tags: Map<PostTag['id'], PostTag> = new Map<PostTag['id'], PostTag>()
  private _actors: Map<Actor['id'], Actor> = new Map<Actor['id'], Actor>()
  private _comments: Map<PostComment['id'], PostComment> = new Map<PostComment['id'], PostComment>()
  private _reactions: Map<PostReaction['userId'], PostReaction> = new Map<PostReaction['userId'], PostReaction>()

  public constructor(
    id: string,
    title: string,
    description: string,
    viewsCount: number,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    publishedAt: DateTime | null
) {
    this.id = id
    this.title = title
    this.description = description
    this.viewsCount = viewsCount
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.publishedAt = publishedAt
  }

  public addMeta(postMeta: PostMeta): void {
    this._meta.set(postMeta.type, postMeta)
  }

  public addTag(postTag: PostTag): void {
    this._tags.set(postTag.id, postTag)
  }

  public addActor(postActor: Actor): void {
    this._actors.set(postActor.id, postActor)
  }

  public addComment(postComment: PostComment): void {
    if (postComment.parentCommentId !== null) {
      const parentComment = this._comments.get(postComment.parentCommentId)

      if (!parentComment) {
        throw PostDomainException.parentCommentNotFound(postComment.parentCommentId)
      }

      try {
        parentComment.addChildComment(postComment)
      }
      catch (exception: unknown) {
        if (!(exception instanceof PostCommentDomainException)) {
          throw exception
        }

        if (exception.id === PostCommentDomainException.cannotAddChildCommentId) {
          throw PostDomainException.cannotAddComment(postComment.id)
        }
      }
    }
    else {
      this._comments.set(postComment.id, postComment)
    }
  }

  public deleteComment(
    postCommentId: PostComment['id'],
    parentCommentId: PostComment['parentCommentId'] | null  
  ): void {
    if (parentCommentId !== null) {
      const parentComment = this._comments.get(parentCommentId)

      if (!parentComment) {
        throw PostDomainException.parentCommentNotFound(parentCommentId)
      }

      try {
        parentComment.deleteChildComment(postCommentId)

        return 
      } 
      catch (exception: unknown) {
        if (!(exception instanceof PostCommentDomainException)) {
          throw exception
        }

        if (exception.id === PostCommentDomainException.childCommentNotFoundId) {
          throw PostDomainException.cannotDeleteComment(postCommentId)
        }
      }
    }

    const commentRemoved = this._comments.delete(postCommentId)

    if (!commentRemoved) {
      throw PostDomainException.cannotDeleteComment(postCommentId)
    } 
  }

  public updateComment(
    postCommentId: PostComment['id'],
    comment: PostComment['comment'],
    parentCommentId: PostComment['parentCommentId'] | null
  ): void {
    if (parentCommentId !== null) {
      const parentComment = this._comments.get(parentCommentId)

      if (!parentComment) {
        throw PostDomainException.parentCommentNotFound(parentCommentId)
      }

      try {
        parentComment.updateChild(postCommentId, comment)

        return 
      } 
      catch (exception: unknown) {
        if (!(exception instanceof PostCommentDomainException)) {
          throw exception
        }

        if (exception.id === PostCommentDomainException.childCommentNotFoundId) {
          throw PostDomainException.cannotUpdateComment(postCommentId)
        }
      }
    }

    const commentToUpdate = this._comments.get(postCommentId)

    if (!commentToUpdate) {
      throw PostDomainException.cannotUpdateComment(postCommentId)
    }

    commentToUpdate.setComment(comment)
    this._comments.set(commentToUpdate.id, commentToUpdate)
  }

  public createComment(postComment: PostComment): void {
    this._comments.set(postComment.id, postComment)
  }

  public addReaction(postReaction: PostReaction): void {
    const existingReaction = this._reactions.get(postReaction.userId)

    if (existingReaction) {
      throw PostDomainException.userAlreadyReacted(postReaction.userId, this.id)
    }

    this._reactions.set(postReaction.userId, postReaction)
  }

  public updateReaction(
    userId: PostReaction['userId'],
    reactionType: PostReaction['reactionType']
  ): void {
    const existingReaction = this._reactions.get(userId)

    if (!existingReaction) {
      throw PostDomainException.userHasNotReacted(userId, this.id)
    }

    existingReaction.reactionType = reactionType

    this._reactions.set(userId, existingReaction)
  }

  public deleteReaction(userId: PostReaction['userId'],): void {
    const reactionRemoved = this._reactions.delete(userId)

    if (!reactionRemoved) {
      throw PostDomainException.cannotDeleteReaction(userId, this.id)
    }
  }

  get meta(): PostMeta[] {
    return Array.from(this._meta.values())
  }

  get tags(): PostTag[] {
    return Array.from(this._tags.values())
  }

  get actors(): Actor[] {
    return Array.from(this._actors.values())
  }

  get comments(): PostComment[] {
    return Array.from(this._comments.values())
  }

  get reactions(): PostReaction[] {
    return Array.from(this._reactions.values())
  }
}