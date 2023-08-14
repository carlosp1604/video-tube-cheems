import { DateTime } from 'luxon'
import { Translation } from '~/modules/Translations/Domain/Translation'

/**
 * Translation model builder for tests
 */
export class TestTranslationBuilder {
  private translatableId: string
  private translatableType: string
  private field: string
  private value: string
  private language: string
  private createdAt: DateTime
  private updatedAt: DateTime

  constructor () {
    this.translatableId = 'test-translatable-id'
    this.translatableType = 'test-translatable-type'
    this.field = 'test-translation-field'
    this.value = 'test-translation-value'
    this.language = 'test-translation-language'
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
  }

  public build (): Translation {
    return new Translation(
      this.translatableId,
      this.translatableType,
      this.field,
      this.value,
      this.language,
      this.createdAt,
      this.updatedAt
    )
  }

  public withTranslatableId (translatableId: string): TestTranslationBuilder {
    this.translatableId = translatableId

    return this
  }

  public withTranslatableType (translatableType: string): TestTranslationBuilder {
    this.translatableType = translatableType

    return this
  }

  public withValue (value: string): TestTranslationBuilder {
    this.value = value

    return this
  }

  public withField (field: string): TestTranslationBuilder {
    this.field = field

    return this
  }

  public withLanguage (language: string): TestTranslationBuilder {
    this.language = language

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestTranslationBuilder {
    this.createdAt = createdAt

    return this
  }

  public withUpdatedAt (updatedAt: DateTime): TestTranslationBuilder {
    this.updatedAt = updatedAt

    return this
  }
}
