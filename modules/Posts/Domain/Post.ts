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
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { PostView } from '~/modules/Posts/Domain/PostView'

export const supportedQualities = ['240p', '360p', '480p', '720p', '1080p', '1440p', '4k']

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly description: string
  public readonly slug: string
  public readonly producerId: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public publishedAt: DateTime | null

  /** Relationships **/
  private _meta: Collection<PostMeta, PostMeta['type']>
  private _tags: Collection<PostTag, PostTag['id']>
  private _actors: Collection<Actor, Actor['id']>
  private _comments: Collection<PostComment, PostComment['id']>
  private _reactions: Collection<PostReaction, PostReaction['userId']>
  private _views: Collection<PostView, PostView['id']>
  private _producer: Relationship<Producer | null>

  public constructor (
    id: string,
    title: string,
    description: string,
    slug: string,
    producerId: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    publishedAt: DateTime | null,
    meta: Collection<PostMeta, PostMeta['type']> = Collection.notLoaded(),
    tags: Collection<PostTag, PostTag['id']> = Collection.notLoaded(),
    actors: Collection<Actor, Actor['id']> = Collection.notLoaded(),
    comments: Collection<PostComment, PostComment['id']> = Collection.notLoaded(),
    reactions: Collection<PostReaction, PostReaction['userId']> = Collection.notLoaded(),
    views: Collection<PostView, PostView['id']> = Collection.notLoaded(),
    producer: Relationship<Producer | null> = Relationship.notLoaded()
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.slug = slug
    this.producerId = producerId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.publishedAt = publishedAt
    this._meta = meta
    this._tags = tags
    this._actors = actors
    this._comments = comments
    this._reactions = reactions
    this._views = views
    this._producer = producer
  }

  public addMeta (postMeta: PostMeta): void {
    this._meta.addItem(postMeta, postMeta.type)
  }

  public addPostReaction (postReaction: PostReaction): void {
    this._reactions.addItem(postReaction, postReaction.userId)
  }

  public addTag (postTag: PostTag): void {
    this._tags.addItem(postTag, postTag.id)
  }

  public addActor (postActor: Actor): void {
    this._actors.addItem(postActor, postActor.id)
  }

  public addChildComment (
    parentCommentId: PostComment['id'],
    comment: PostComment['comment'],
    userId: PostComment['userId']
  ): PostChildComment {
    const parentComment = this._comments.getItem(parentCommentId)

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

    this._comments.addItem(commentToAdd, commentToAdd.id)

    return commentToAdd
  }

  public deleteComment (
    postCommentId: PostComment['id']
  ): void {
    const commentRemoved = this._comments.removeItem(postCommentId)

    if (!commentRemoved) {
      throw PostDomainException.cannotDeleteComment(postCommentId)
    }
  }

  public updateComment (
    postCommentId: PostComment['id'],
    comment: PostComment['comment']
  ): PostComment {
    // TODO: Fix this method
    const commentToUpdate = this._comments.getItem(postCommentId)

    if (!commentToUpdate) {
      throw PostDomainException.cannotUpdateComment(postCommentId)
    }

    if (commentToUpdate.comment === comment) {
      return commentToUpdate
    }

    commentToUpdate.setComment(comment)
    commentToUpdate.setUpdatedAt(DateTime.now())
    this._comments.addItem(commentToUpdate, commentToUpdate.id)

    return commentToUpdate
  }

  public createComment (postComment: PostComment): void {
    this._comments.addItem(postComment, postComment.id)
  }

  public createReaction (postReaction: PostReaction): void {
    this._reactions.addItem(postReaction, postReaction.userId)
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

    const existingReaction = this._reactions.getItem(postReaction.userId)

    if (existingReaction) {
      throw PostDomainException.userAlreadyReacted(postReaction.userId, this.id)
    }

    this._reactions.addItem(postReaction, postReaction.userId)

    return postReaction
  }

  public updateReaction (
    userId: PostReaction['userId'],
    reactionType: PostReaction['reactionType']
  ): PostReaction {
    const existingReaction = this._reactions.getItem(userId)

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

    this._reactions.addItem(existingReaction, userId)

    return existingReaction
  }

  public deleteReaction (userId: PostReaction['userId']): void {
    const reactionRemoved = this._reactions.removeItem(userId)

    if (!reactionRemoved) {
      throw PostDomainException.cannotDeleteReaction(userId, this.id)
    }
  }

  get meta (): PostMeta[] {
    return this._meta.values
  }

  get tags (): PostTag[] {
    return this._tags.values
  }

  get actors (): Actor[] {
    return this._actors.values
  }

  get comments (): PostComment[] {
    return this._comments.values
  }

  get producer (): Producer | null {
    return this._producer.value ?? null
  }

  public setProducer (producer: Producer): void {
    if (this.producer !== null) {
      throw PostDomainException.producerAlreadySet(this.id)
    }

    this._producer = Relationship.createRelation(producer)
  }

  get reactions (): PostReaction[] {
    return this._reactions.values
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
