import { DateTime } from 'luxon'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'

/**
 * Producer model builder for tests
 */
export class TestProducerBuilder {
  private id: string
  private name: string
  private description: string
  private imageUrl: string | null
  private parentProducerId: string | null
  private brandHexColor: string
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null
  private _parentProducer: Relationship<Producer | null>

  constructor () {
    this.id = 'test-producer-id'
    this.name = 'test-producer-name'
    this.description = 'test-producer-description'
    this.imageUrl = null
    this.parentProducerId = null
    this.brandHexColor = 'test-producer-brand-hex-color'
    this.description = 'test-producer-description'
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
    this._parentProducer = Relationship.notLoaded()
  }

  public build (): Producer {
    return new Producer(
      this.id,
      this.name,
      this.description,
      this.imageUrl,
      this.parentProducerId,
      this.brandHexColor,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
      this._parentProducer
    )
  }

  public withId (id: string): TestProducerBuilder {
    this.id = id

    return this
  }

  public withName (name: string): TestProducerBuilder {
    this.name = name

    return this
  }

  public withDescription (description: string): TestProducerBuilder {
    this.description = description

    return this
  }

  public withImageUrl (imageUrl: string | null): TestProducerBuilder {
    this.imageUrl = imageUrl

    return this
  }

  public withParentProducerId (parentProducerId: string | null): TestProducerBuilder {
    this.parentProducerId = parentProducerId

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestProducerBuilder {
    this.createdAt = createdAt

    return this
  }

  public withUpdatedAt (updatedAt: DateTime): TestProducerBuilder {
    this.updatedAt = updatedAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestProducerBuilder {
    this.deletedAt = deletedAt

    return this
  }

  public withParentProducer (parentProducerRelationship: Relationship<Producer | null>): TestProducerBuilder {
    this._parentProducer = parentProducerRelationship

    return this
  }
}
