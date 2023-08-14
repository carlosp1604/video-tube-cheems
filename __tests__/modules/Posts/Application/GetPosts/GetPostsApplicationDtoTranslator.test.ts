import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'
import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { DateTime } from 'luxon'
import { GetPostsApplicationDtoTranslator } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDtoTranslator'

describe('~/modules/Posts/Application/GetPosts/GetPostsApplicationDtoTranslator.ts', () => {
  const postsWithCount: PostWithCountInterface[] = []
  const nowDate = DateTime.now()

  beforeEach(() => {
    postsWithCount.push({
      post: new TestPostBuilder().build(),
      postComments: 1,
      postViews: 20,
      postReactions: 10,
    })

    jest.spyOn(PostWithProducerAndMetaApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce(
      {
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
        publishedAt: nowDate.toISO(),
        title: 'expected-title',
        slug: 'expected-post-slug',
      }
    )
  })

  it('should translate data correctly', () => {
    const translation = GetPostsApplicationDtoTranslator.fromDomain(postsWithCount, 1)

    expect(translation).toStrictEqual({
      posts: [{
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
          ],
          slug: 'expected-post-slug',
        },
        postComments: 1,
        postViews: 20,
        postReactions: 10,
      }],
      postsNumber: 1,
    })
  })
})
