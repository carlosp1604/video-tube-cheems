import { PostMeta } from './PostMeta'
import { PostTag } from './PostTag'
import { DateTime } from 'luxon'
import { PostComment } from './PostComment'
import { PostReaction } from './PostReaction'
import { PostDomainException } from './PostDomainException'
import { randomUUID } from 'crypto'
import { PostChildComment } from './PostChildComment'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { PostView } from '~/modules/Posts/Domain/PostView'

export const supportedQualities = ['240p', '360p', '480p', '720p', '1080p', '1440p', '4k']

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly description: string
  public readonly producerId: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public publishedAt: DateTime | null
  private _meta: Map<string, PostMeta> = new Map<string, PostMeta>()
  private _tags: Map<PostTag['id'], PostTag> = new Map<PostTag['id'], PostTag>()
  private _actors: Map<Actor['id'], Actor> = new Map<Actor['id'], Actor>()
  private _comments: Map<PostComment['id'], PostComment> = new Map<PostComment['id'], PostComment>()
  private _reactions: Map<PostReaction['userId'], PostReaction> = new Map<PostReaction['userId'], PostReaction>()
  public producer: Producer | null = null

  public constructor (
    id: string,
    title: string,
    description: string,
    producerId: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    publishedAt: DateTime | null
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.producerId = producerId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.publishedAt = publishedAt
  }

  public addMeta (postMeta: PostMeta): void {
    this._meta.set(postMeta.type, postMeta)
  }

  public addPostReaction (postReaction: PostReaction): void {
    this._reactions.set(postReaction.userId, postReaction)
  }

  public addTag (postTag: PostTag): void {
    this._tags.set(postTag.id, postTag)
  }

  public addActor (postActor: Actor): void {
    this._actors.set(postActor.id, postActor)
  }

  public addChildComment (
    parentCommentId: PostComment['id'],
    comment: PostComment['comment'],
    userId: PostComment['userId']
  ): PostChildComment {
    const parentComment = this._comments.get(parentCommentId)

    if (!parentComment) {
      throw PostDomainException.parentCommentNotFound(parentCommentId)
    }

    return parentComment.addChildComment(comment, userId)
  }

  public addComment (
    comment: PostComment['comment'],
    userId: PostComment['userId']
  ): PostComment {
    const commentToAdd = this.buildComment(comment, userId)

    this._comments.set(commentToAdd.id, commentToAdd)

    return commentToAdd
  }

  public deleteComment (
    postCommentId: PostComment['id']
  ): void {
    const commentRemoved = this._comments.delete(postCommentId)

    if (!commentRemoved) {
      throw PostDomainException.cannotDeleteComment(postCommentId)
    }
  }

  public updateComment (
    postCommentId: PostComment['id'],
    comment: PostComment['comment']
  ): PostComment {
    // TODO: Fix this method
    const commentToUpdate = this._comments.get(postCommentId)

    if (!commentToUpdate) {
      throw PostDomainException.cannotUpdateComment(postCommentId)
    }

    if (commentToUpdate.comment === comment) {
      return commentToUpdate
    }

    commentToUpdate.setComment(comment)
    commentToUpdate.setUpdatedAt(DateTime.now())
    this._comments.set(commentToUpdate.id, commentToUpdate)

    return commentToUpdate
  }

  public createComment (postComment: PostComment): void {
    this._comments.set(postComment.id, postComment)
  }

  public createReaction (postReaction: PostReaction): void {
    this._reactions.set(postReaction.userId, postReaction)
  }

  public addReaction (
    userId: PostReaction['userId'],
    reactionType: string
  ): PostReaction {
    let postReaction

    try {
      postReaction = this.buildReaction(userId, reactionType)
    } catch (exception: unknown) {
      throw PostDomainException.cannotAddReaction(userId, this.id)
    }

    const existingReaction = this._reactions.get(postReaction.userId)

    if (existingReaction) {
      throw PostDomainException.userAlreadyReacted(postReaction.userId, this.id)
    }

    this._reactions.set(postReaction.userId, postReaction)

    return postReaction
  }

  public updateReaction (
    userId: PostReaction['userId'],
    reactionType: PostReaction['reactionType']
  ): PostReaction {
    const existingReaction = this._reactions.get(userId)

    if (!existingReaction) {
      throw PostDomainException.userHasNotReacted(userId, this.id)
    }

    if (existingReaction.reactionType === reactionType) {
      return existingReaction
    }

    try {
      existingReaction.setReactionType(reactionType)
      existingReaction.setUpdatedAt(DateTime.now())
    } catch (exception: unknown) {
      throw PostDomainException.cannotUpdateReaction(userId, this.id)
    }

    this._reactions.set(userId, existingReaction)

    return existingReaction
  }

  public deleteReaction (userId: PostReaction['userId']): void {
    const reactionRemoved = this._reactions.delete(userId)

    if (!reactionRemoved) {
      throw PostDomainException.cannotDeleteReaction(userId, this.id)
    }
  }

  get meta (): PostMeta[] {
    return Array.from(this._meta.values())
  }

  get tags (): PostTag[] {
    return Array.from(this._tags.values())
  }

  get actors (): Actor[] {
    return Array.from(this._actors.values())
  }

  get comments (): PostComment[] {
    return Array.from(this._comments.values())
  }

  public setProducer (producer: Producer): void {
    if (this.producer !== null) {
      throw PostDomainException.producerAlreadySet(this.id)
    }

    this.producer = producer
  }

  get reactions (): PostReaction[] {
    return Array.from(this._reactions.values())
  }

  private buildComment (
    comment: PostComment['comment'],
    userId: PostComment['userId']
  ): PostComment {
    const nowDate = DateTime.now()

    return new PostComment(
      randomUUID(),
      comment,
      this.id,
      userId,
      nowDate,
      nowDate,
      null
    )
  }

  private buildReaction (
    userId: PostReaction['userId'],
    reactionType: string
  ): PostReaction {
    const nowDate = DateTime.now()

    return new PostReaction(
      this.id,
      userId,
      reactionType,
      nowDate,
      nowDate,
      null
    )
  }
}
