import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { DateTime } from 'luxon'
import { TestPostMetaBuilder } from '~/__tests__/modules/Posts/Domain/TestPostMetaBuilder'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { TestProducerBuilder } from '~/__tests__/modules/Producers/Domain/TestProducerBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { TestTranslationBuilder } from '~/__tests__/modules/Translations/Domain/TestTranslationBuilder'

describe('~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator.ts', () => {
  let testPostBuilder: TestPostBuilder
  const nowDate = DateTime.now()
  let postMeta: PostMeta
  let producer: Producer

  beforeEach(() => {
    postMeta = new TestPostMetaBuilder()
      .withType('expected-post-meta-type')
      .withValue('expected-post-meta-value')
      .withPostId('expected-post-id')
      .withCreatedAt(nowDate)
      .build()

    const parentProducer = new TestProducerBuilder()
      .withId('expected-parent-producer-id')
      .withDescription('expected-parent-producer-description')
      .withName('expected-parent-producer-name')
      .withCreatedAt(nowDate)
      .withImageUrl('expected-parent-producer-image-url')
      .withParentProducer(Relationship.initializeRelation(null))
      .build()

    producer = new TestProducerBuilder()
      .withId('expected-producer-id')
      .withDescription('expected-producer-description')
      .withName('expected-producer-name')
      .withCreatedAt(nowDate)
      .withImageUrl('expected-image-url')
      .withParentProducer(Relationship.initializeRelation(parentProducer))
      .withParentProducerId('expected-parent-producer-id')
      .build()

    const metaCollection: Collection<PostMeta, PostMeta['type']> = Collection.initializeCollection()
    const producerRelationship = Relationship.initializeRelation(producer)

    metaCollection.addItem(postMeta, postMeta.type)

    const translationsCollection = Collection.initializeCollection<Translation, string>()

    translationsCollection.addItemFromPersistenceLayer(
      new TestTranslationBuilder()
        .withTranslatableId('expected-post-id')
        .withTranslatableType('Post')
        .withField('title')
        .withValue('Some expected post title')
        .withLanguage('es')
        .withCreatedAt(nowDate)
        .build(),
      'expected-translation-key'
    )

    translationsCollection.addItemFromPersistenceLayer(
      new TestTranslationBuilder()
        .withTranslatableId('expected-post-id')
        .withTranslatableType('Post')
        .withField('title')
        .withValue('Some expected post title en')
        .withLanguage('en')
        .withCreatedAt(nowDate)
        .build(),
      'expected-another-translation-key'
    )

    testPostBuilder = new TestPostBuilder()
      .withId('expected-post-id')
      .withTitle('expected-title')
      .withSlug('expected-post-slug')
      .withDescription('expected-description')
      .withCreatedAt(nowDate)
      .withMeta(metaCollection)
      .withProducer(producerRelationship)
      .withTranslations(translationsCollection)
      .withPublishedAt(nowDate)
  })

  it('should translate data correctly', () => {
    const post = testPostBuilder.build()
    const translation = PostWithProducerAndMetaApplicationDtoTranslator.fromDomain(post)

    expect(translation).toStrictEqual({
      createdAt: nowDate.toISO(),
      description: 'expected-description',
      id: 'expected-post-id',
      slug: 'expected-post-slug',
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'expected-post-meta-type',
          value: 'expected-post-meta-value',
        },
      ],
      producer: {
        brandHexColor: 'test-producer-brand-hex-color',
        createdAt: nowDate.toISO(),
        description: 'expected-producer-description',
        id: 'expected-producer-id',
        imageUrl: 'expected-image-url',
        name: 'expected-producer-name',
        parentProducer: {
          brandHexColor: 'test-producer-brand-hex-color',
          createdAt: nowDate.toISO(),
          description: 'expected-parent-producer-description',
          id: 'expected-parent-producer-id',
          imageUrl: 'expected-parent-producer-image-url',
          name: 'expected-parent-producer-name',
          parentProducer: null,
          parentProducerId: null,
        },
        parentProducerId: 'expected-parent-producer-id',
      },
      publishedAt: nowDate.toISO(),
      title: 'expected-title',
      translations: [
        {
          translations: [
            {
              createdAt: nowDate.toISO(),
              language: 'es',
              value: 'Some expected post title',
              translatableId: 'expected-post-id',
              field: 'title',
            },
          ],
          language: 'es',
        },
        {
          translations: [
            {
              createdAt: nowDate.toISO(),
              language: 'en',
              value: 'Some expected post title en',
              translatableId: 'expected-post-id',
              field: 'title',
            },
          ],
          language: 'en',
        },
      ],
    })
  })

  it('should handle nullish properties', () => {
    const post = testPostBuilder
      .withProducer(Relationship.initializeRelation(null))
      .build()

    const translation = PostWithProducerAndMetaApplicationDtoTranslator.fromDomain(post)

    expect(translation).toStrictEqual({
      createdAt: nowDate.toISO(),
      description: 'expected-description',
      id: 'expected-post-id',
      slug: 'expected-post-slug',
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'expected-post-meta-type',
          value: 'expected-post-meta-value',
        },
      ],
      producer: null,
      publishedAt: nowDate.toISO(),
      title: 'expected-title',
      translations: [
        {
          translations: [
            {
              createdAt: nowDate.toISO(),
              language: 'es',
              value: 'Some expected post title',
              translatableId: 'expected-post-id',
              field: 'title',
            },
          ],
          language: 'es',
        },
        {
          translations: [
            {
              createdAt: nowDate.toISO(),
              language: 'en',
              value: 'Some expected post title en',
              translatableId: 'expected-post-id',
              field: 'title',
            },
          ],
          language: 'en',
        },
      ],
    })
  })
})
