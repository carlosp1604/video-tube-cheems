import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { TestProducerBuilder } from '~/__tests__/modules/Producers/Domain/TestProducerBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { TestPostMetaBuilder } from '~/__tests__/modules/Posts/Domain/TestPostMetaBuilder'
import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { DateTime } from 'luxon'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'
import {
  GetRelatedPostsApplicationDtoTranslator
} from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationDtoTranslator'

describe('~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts.ts', () => {
  const nowDate = DateTime.now()
  const postsWithCount: PostWithCountInterface[] = []

  beforeEach(() => {
    const producer = new TestProducerBuilder().build()

    const metaCollection: Collection<PostMeta, PostMeta['type']> = Collection.initializeCollection()
    const producerRelationship = Relationship.initializeRelation(producer)

    const postMeta = new TestPostMetaBuilder().build()

    metaCollection.addItem(postMeta, postMeta.type)

    postsWithCount.push({
      post: new TestPostBuilder()
        .withMeta(metaCollection)
        .withProducer(producerRelationship)
        .build(),
      postComments: 1,
      postReactions: 1,
      postViews: 1,
    })

    jest.spyOn(PostWithProducerAndMetaApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
      createdAt: nowDate.toISO(),
      description: 'expected-description',
      id: 'expected-post-id',
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
        parentProducer: null,
        parentProducerId: 'expected-parent-producer-id',
      },
      publishedAt: nowDate.toISO(),
      title: 'expected-title',
      slug: 'expected-post-slug',
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
      ],
    })
  })

  it('should translate data correctly', () => {
    const translatedData = GetRelatedPostsApplicationDtoTranslator.fromDomain(postsWithCount)

    expect(translatedData).toStrictEqual({
      posts: [
        {
          post: {
            createdAt: nowDate.toISO(),
            description: 'expected-description',
            id: 'expected-post-id',
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
              parentProducer: null,
              parentProducerId: 'expected-parent-producer-id',
            },
            publishedAt: nowDate.toISO(),
            title: 'expected-title',
            slug: 'expected-post-slug',
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
            ],
          },
          postComments: 1,
          postReactions: 1,
          postViews: 1,
        },
      ],
    })
  })
})
