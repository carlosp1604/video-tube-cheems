export class Actor {
  public readonly id: string
  public readonly name: string
  public readonly description: string | null
  public readonly imageUrl: string | null
  public viewsCount: number
  public readonly createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  public constructor(
    id: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    viewsCount: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.viewsCount = viewsCount
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}