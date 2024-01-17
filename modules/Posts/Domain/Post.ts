import { PostMeta } from './PostMeta'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import { DateTime } from 'luxon'
import { PostComment } from './PostComments/PostComment'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'
import { PostDomainException } from './PostDomainException'
import { randomUUID } from 'crypto'
import { PostChildComment } from './PostComments/PostChildComment'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { User } from '~/modules/Auth/Domain/User'
import { PostCommentDomainException } from '~/modules/Posts/Domain/PostComments/PostCommentDomainException'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { TranslatableModel } from '~/modules/Translations/Domain/TranslatableModel'
import { applyMixins } from '~/helpers/Domain/Mixins'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'

export const supportedQualities = ['240p', '360p', '480p', '720p', '1080p', '1440p', '4k']

export enum PostType {
  VIDEO = 'video',
  IMAGES = 'images',
  MIXED = 'mixed'
}

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly type: PostType
  public readonly description: string
  public readonly slug: string
  public readonly producerId: string | null
  public readonly actorId: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public publishedAt: DateTime | null

  /** Relationships **/
  private _meta: Collection<PostMeta, PostMeta['type']>
  private _tags: Collection<PostTag, PostTag['id']>
  private _actors: Collection<Actor, Actor['id']>
  private _comments: Collection<PostComment, PostComment['id']>
  private _views: Collection<PostView, PostView['id']>
  private _producer: Relationship<Producer | null>
  private _actor: Relationship<Actor | null>
  private _postMedia: Collection<PostMedia, PostMedia['id']>

  public constructor (
    id: string,
    title: string,
    type: string,
    description: string,
    slug: string,
    producerId: string | null,
    actorId: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    publishedAt: DateTime | null,
    meta: Collection<PostMeta, PostMeta['type']> = Collection.notLoaded(),
    tags: Collection<PostTag, PostTag['id']> = Collection.notLoaded(),
    actors: Collection<Actor, Actor['id']> = Collection.notLoaded(),
    comments: Collection<PostComment, PostComment['id']> = Collection.notLoaded(),
    reactions: Collection<Reaction, Reaction['userId']> = Collection.notLoaded(),
    views: Collection<PostView, PostView['id']> = Collection.notLoaded(),
    producer: Relationship<Producer | null> = Relationship.notLoaded(),
    translations: Collection<Translation, Translation['language'] & Translation['field']> = Collection.notLoaded(),
    actor: Relationship<Actor | null> = Relationship.notLoaded(),
    postMedia: Collection<PostMedia, PostMedia['id']> = Collection.notLoaded()
  ) {
    this.id = id
    this.title = title
    this.type = Post.validatePostType(type)
    this.description = description
    this.slug = slug
    this.producerId = producerId
    this.actorId = actorId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.publishedAt = publishedAt
    this._meta = meta
    this._tags = tags
    this._actors = actors
    this._comments = comments
    this._views = views
    this._producer = producer
    this._actor = actor
    this._postMedia = postMedia
    this.modelReactions = reactions
    this.modelTranslations = translations
  }

  public addMeta (postMeta: PostMeta): void {
    this._meta.addItem(postMeta, postMeta.type)
  }

  public addTranslation (translation: Translation): void {
    this.modelTranslations.addItem(translation, translation.language + translation.field)
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
    user: User
  ): PostChildComment {
    const parentComment = this._comments.getItem(parentCommentId)

    if (!parentComment) {
      throw PostDomainException.parentCommentNotFound(parentCommentId)
    }

    return parentComment.addChildComment(comment, user)
  }

  public createPostReaction (userId: User['id'], reactionType: string): Reaction {
    return this.addReaction(this.id, ReactionableType.POST, userId, reactionType)
  }

  public updatePostReaction (userId: User['id'], reactionType: string): Reaction {
    return this.addReaction(this.id, ReactionableType.POST, userId, reactionType)
  }

  public deletePostReaction (userId: User['id']): void {
    return this.deleteReaction(this.id, ReactionableType.POST, userId)
  }

  public addComment (
    comment: PostComment['comment'],
    user: User
  ): PostComment {
    const commentToAdd = this.buildComment(comment, user)

    this._comments.addItem(commentToAdd, commentToAdd.id)

    return commentToAdd
  }

  public deleteComment (postCommentId: PostComment['id'], userId: PostComment['id']): void {
    const commentToRemove = this._comments.getItem(postCommentId)

    if (commentToRemove === null) {
      throw PostDomainException.postCommentNotFound(postCommentId)
    }

    if (commentToRemove.userId !== userId) {
      throw PostDomainException.userCannotDeleteComment(postCommentId, userId)
    }

    const commentRemoved = this._comments.removeItem(postCommentId)

    if (!commentRemoved) {
      throw PostDomainException.cannotDeleteComment(postCommentId)
    }
  }

  public deleteChildComment (
    parentCommentId: PostComment['id'],
    postCommentId: PostChildComment['id'],
    userId: PostChildComment['userId']
  ): void {
    const parentComment = this._comments.getItem(parentCommentId)

    if (parentComment === null) {
      throw PostDomainException.parentCommentNotFound(parentCommentId)
    }

    try {
      parentComment.removeChildComment(postCommentId, userId)
    } catch (exception: unknown) {
      if (!(exception instanceof PostCommentDomainException)) {
        throw exception
      }

      if (exception.id === PostCommentDomainException.childCommentNotFoundId) {
        throw PostDomainException.postCommentNotFound(postCommentId)
      }

      if (exception.id === PostCommentDomainException.userCannotDeleteChildCommentId) {
        throw PostDomainException.userCannotDeleteComment(userId, postCommentId)
      }

      if (exception.id === PostCommentDomainException.cannotDeleteChildCommentId) {
        throw PostDomainException.cannotDeleteComment(postCommentId)
      }

      throw exception
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
    return this._producer.value
  }

  get postMedia (): Array<PostMedia> {
    return this._postMedia.values
  }

  get actor (): Actor | null {
    return this._actor.value
  }

  public setProducer (producer: Producer): void {
    if (this.producer !== null) {
      throw PostDomainException.producerAlreadySet(this.id)
    }

    this._producer = Relationship.createRelation(producer)
  }

  private buildComment (
    comment: PostComment['comment'],
    user: User
  ): PostComment {
    const nowDate = DateTime.now()

    return new PostComment(
      randomUUID(),
      comment,
      this.id,
      user.id,
      nowDate,
      nowDate,
      null,
      Relationship.initializeRelation(user)
    )
  }

  private static validatePostType (value: string): PostType {
    const values: string [] = Object.values(PostType)

    if (!values.includes(value)) {
      throw PostDomainException.invalidPostType(value)
    }

    return value as PostType
  }
}

export interface Post extends ReactionableModel, TranslatableModel {}

applyMixins(Post, [ReactionableModel, TranslatableModel])
