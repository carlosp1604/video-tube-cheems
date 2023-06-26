import { DateTime } from 'luxon'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'

/**
 * PostMeta model builder for tests
 */
export class TestPostMetaBuilder {
  private type: string
  private value: string
  private postId: string
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null

  constructor () {
    this.type = 'test-post-meta-type'
    this.value = 'test-post-meta-value'
    this.postId = 'test-post-id'
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
  }

  public build (): PostMeta {
    return new PostMeta(
      this.type,
      this.value,
      this.postId,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    )
  }

  public withType (type: string): TestPostMetaBuilder {
    this.type = type

    return this
  }

  public withValue (value: string): TestPostMetaBuilder {
    this.value = value

    return this
  }

  public withPostId (postId: string): TestPostMetaBuilder {
    this.postId = postId

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostMetaBuilder {
    this.createdAt = createdAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestPostMetaBuilder {
    this.deletedAt = deletedAt

    return this
  }
}
