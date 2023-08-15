import { DateTime } from 'luxon'
import { PostTag } from '~/modules/Posts/Domain/PostTag'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Translation } from '~/modules/Translations/Domain/Translation'

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
  private _translations: Collection<Translation, string>

  constructor () {
    this.id = 'test-actor-id'
    this.name = 'test-actor-name'
    this.description = 'test-actor-description'
    this.imageUrl = null
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
    this._translations = Collection.notLoaded()
  }

  public build (): PostTag {
    return new PostTag(
      this.id,
      this.name,
      this.description,
      this.imageUrl,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
      this._translations
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

  public withTranslations (translations: Collection<Translation, string>): TestPostTagBuilder {
    this._translations = translations

    return this
  }
}
