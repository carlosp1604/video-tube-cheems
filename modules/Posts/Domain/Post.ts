import { PostMeta } from './PostMeta'
import { PostTag } from './PostTag'
import { Actor } from './Actor'
import { DateTime } from 'luxon'
import { PostComment } from './PostComment'
import { PostReaction } from './PostReaction'
import { PostDomainException } from './PostDomainException'

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

      parentComment.addChildComment(postComment)
    }
    else {
      this._comments.set(postComment.id, postComment)
    }
  }

  public createComment(postComment: PostComment): void {
    this._comments.set(postComment.id, postComment)
  }

  public addReaction(postReaction: PostReaction): void {
    this._reactions.set(postReaction.userId, postReaction)
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