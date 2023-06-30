import { DateTime } from 'luxon'
import { PostTag } from '~/modules/Posts/Domain/PostTag'

/**
 * PostTag model builder for tests
 */
export class TestPostTagBuilder {
  private id: string
  private name: string
  private description: string
  private imageUrl: string | null
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null

  constructor () {
    this.id = 'test-actor-id'
    this.name = 'test-actor-name'
    this.description = 'test-actor-description'
    this.imageUrl = null
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
  }

  public build (): PostTag {
    return new PostTag(
      this.id,
      this.name,
      this.description,
      this.imageUrl,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    )
  }

  public withId (id: string): TestPostTagBuilder {
    this.id = id

    return this
  }

  public withName (name: string): TestPostTagBuilder {
    this.name = name

    return this
  }

  public withDescription (description: string): TestPostTagBuilder {
    this.description = description

    return this
  }

  public withImageUrl (imageUrl: string | null): TestPostTagBuilder {
    this.imageUrl = imageUrl

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostTagBuilder {
    this.createdAt = createdAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestPostTagBuilder {
    this.deletedAt = deletedAt

    return this
  }
}
