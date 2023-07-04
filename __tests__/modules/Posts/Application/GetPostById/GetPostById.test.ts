import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { GetPostById } from '~/modules/Posts/Application/GetPostById/GetPostById'
import { DateTime } from 'luxon'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { TestProducerBuilder } from '~/__tests__/modules/Producers/Domain/TestProducerBuilder'
import { TestPostMetaBuilder } from '~/__tests__/modules/Posts/Domain/TestPostMetaBuilder'
import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { PostApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostApplicationDtoTranslator'

describe('~/modules/Posts/Application/GetPostById/GetPostById.ts', () => {
  const postRepository = mock<PostRepositoryInterface>()
  const nowDate = DateTime.now()

  const buildUseCase = (): GetPostById => {
    return new GetPostById(postRepository)
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

    postRepository.findByIdWithCount.mockResolvedValueOnce(Promise.resolve(postWithCount))

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
    })
  })

  it('should call to repository correctly', async () => {
    const useCase = buildUseCase()

    await useCase.get({
      postId: 'expected-post-id',
    })

    expect(postRepository.findByIdWithCount).toBeCalledWith('expected-post-id')
  })

  it('should return correct data', async () => {
    const useCase = buildUseCase()

    const post = await useCase.get({
      postId: 'expected-post-id',
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
      },
      reactions: 1,
      comments: 1,
      views: 1,
    })
  })
})
