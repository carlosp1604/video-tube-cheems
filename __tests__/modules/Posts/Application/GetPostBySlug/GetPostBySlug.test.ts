import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { DateTime } from 'luxon'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { TestProducerBuilder } from '~/__tests__/modules/Producers/Domain/TestProducerBuilder'
import { TestPostMetaBuilder } from '~/__tests__/modules/Posts/Domain/TestPostMetaBuilder'
import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { PostApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostApplicationDtoTranslator'

describe('~/modules/Posts/Application/GetPostBySlug/GetPostBySlug.ts', () => {
  const postRepository = mock<PostRepositoryInterface>()
  const nowDate = DateTime.now()

  const buildUseCase = (): GetPostBySlug => {
    return new GetPostBySlug(postRepository)
  }

  beforeEach(() => {
    const metaCollection: Collection<PostMeta, PostMeta['type']> = Collection.initializeCollection()
    const producerRelationship = Relationship.initializeRelation(new TestProducerBuilder().build())

    const postMeta = new TestPostMetaBuilder().build()

    metaCollection.addItem(postMeta, postMeta.type)

    const postWithCount = {
      post: new TestPostBuilder()
        .withMeta(metaCollection)
        .withProducer(producerRelationship)
        .withActors(Collection.initializeCollection())
        .withTags(Collection.initializeCollection())
        .build(),
      postComments: 1,
      postReactions: 1,
      postViews: 1,
    }

    postRepository.findBySlugWithCount.mockResolvedValueOnce(Promise.resolve(postWithCount))

    jest.spyOn(PostApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
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
      actors: [],
      tags: [],
      slug: 'expected-post-slug',
    })
  })

  it('should call to repository correctly', async () => {
    const useCase = buildUseCase()

    await useCase.get({
      slug: 'expected-post-slug',
    })

    expect(postRepository.findBySlugWithCount).toBeCalledWith('expected-post-slug')
  })

  it('should return correct data', async () => {
    const useCase = buildUseCase()

    const post = await useCase.get({
      slug: 'expected-post-slug',
    })

    expect(post).toStrictEqual({
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
        actors: [],
        tags: [],
        slug: 'expected-post-slug',
      },
      reactions: 1,
      comments: 1,
      views: 1,
    })
  })
})
