import { Actor } from '~/modules/Actors/Domain/Actor'
import { DateTime } from 'luxon'

/**
 * Actor model builder for tests
 */
export class TestActorBuilder {
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

  public build (): Actor {
    return new Actor(
      this.id,
      this.name,
      this.description,
      this.imageUrl,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    )
  }

  public withId (id: string): TestActorBuilder {
    this.id = id

    return this
  }

  public withName (name: string): TestActorBuilder {
    this.name = name

    return this
  }

  public withDescription (description: string): TestActorBuilder {
    this.description = description

    return this
  }

  public withImageUrl (imageUrl: string | null): TestActorBuilder {
    this.imageUrl = imageUrl

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestActorBuilder {
    this.createdAt = createdAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestActorBuilder {
    this.deletedAt = deletedAt

    return this
  }
}
