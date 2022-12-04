export class PostMeta {
  public readonly type: string
  public readonly value: string
  public readonly postId: string
  public readonly createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  public constructor(
    type: string,
    value: string,
    postId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    this.type = type
    this.value = value
    this.postId = postId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}