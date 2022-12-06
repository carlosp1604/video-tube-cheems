import { PostMeta } from './PostMeta'
import { PostTag } from './PostTag'
import { Actor } from './Actor'

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly description: string
  public viewsCount: number
  public readonly createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null
  public meta: PostMeta[] = []
  public tags: PostTag[] = []
  public actors: Actor[] = []

  public constructor(
    id: string,
    title: string,
    description: string,
    viewsCount: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.viewsCount = viewsCount
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public addMeta(postMeta: PostMeta): void {
    this.meta.push(postMeta)
  }

  public addTag(postTag: PostTag): void {
    this.tags.push(postTag)
  }

  public addActor(postActor: Actor): void {
    this.actors.push(postActor)
  }
}