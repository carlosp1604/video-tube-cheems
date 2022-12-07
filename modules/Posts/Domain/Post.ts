import { PostMeta } from './PostMeta'
import { PostTag } from './PostTag'
import { Actor } from './Actor'
import { DateTime } from 'luxon'

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly description: string
  public viewsCount: number
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public publishedAt: DateTime | null
  public meta: Map<string, PostMeta> = new Map<string, PostMeta>()
  public tags: Map<PostTag['id'], PostTag> = new Map<PostTag['id'], PostTag>()
  public actors: Map<Actor['id'], Actor> = new Map<Actor['id'], Actor>()

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
    if (this.meta.has(postMeta.type)) {
      return
    }

    this.meta.set(postMeta.type, postMeta)
  }

  public addTag(postTag: PostTag): void {
    if (this.tags.has(postTag.id)) {
      return
    }

    this.tags.set(postTag.id, postTag)
  }

  public addActor(postActor: Actor): void {
    if (this.actors.has(postActor.id)) {
      return
    }

    this.actors.set(postActor.id, postActor)
  }
}