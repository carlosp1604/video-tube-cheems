import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { TestProducerBuilder } from '~/__tests__/modules/Producers/Domain/TestProducerBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { DateTime } from 'luxon'
import { TestPostMetaBuilder } from '~/__tests__/modules/Posts/Domain/TestPostMetaBuilder'
import {
  GetRelatedPostsApplicationDtoTranslator
} from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationDtoTranslator'

describe('~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts.ts', () => {
  const postRepository = mock<PostRepositoryInterface>()
  const nowDate = DateTime.now()

  const buildUseCase = (): GetRelatedPosts => {
    return new GetRelatedPosts(postRepository)
  }

  beforeEach(() => {
    const postsWithCount: PostWithCountInterface[] = []

    const metaCollection: Collection<PostMeta, PostMeta['type']> = Collection.initializeCollection()
    const producerRelationship = Relationship.initializeRelation(new TestProducerBuilder().build())

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

    postRepository.getRelatedPosts.mockResolvedValueOnce(Promise.resolve(postsWithCount))

    jest.spyOn(GetRelatedPostsApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
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
          },
          postComments: 1,
          postReactions: 1,
          postViews: 1,
        },
      ],
    })
  })

  it('should call to repository correctly', async () => {
    const useCase = buildUseCase()

    await useCase.get('input-post-id')

    expect(postRepository.getRelatedPosts).toBeCalledWith('input-post-id')
  })

  it('should return correct data', async () => {
    const useCase = buildUseCase()

    const relatedPosts = await useCase.get('input-post-id')

    expect(relatedPosts).toStrictEqual({
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
          },
          postComments: 1,
          postReactions: 1,
          postViews: 1,
        },
      ],
    })
  })
})
