import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { GetPostsRequestDto } from '~/modules/Posts/Application/GetPosts/GetPostsRequestDto'
import { RepositoryFilterStringTypeOption } from '~/modules/Shared/Domain/RepositoryFilterOption'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'
import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { TestProducerBuilder } from '~/__tests__/modules/Producers/Domain/TestProducerBuilder'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { TestPostMetaBuilder } from '~/__tests__/modules/Posts/Domain/TestPostMetaBuilder'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { GetPostsApplicationDtoTranslator } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDtoTranslator'
import { DateTime } from 'luxon'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'

describe('~/modules/Posts/Application/GetPosts/GetPosts.ts', () => {
  const postRepository = mock<PostRepositoryInterface>()
  let request: GetPostsRequestDto
  let post: Post
  let postsWithCount: PostWithCountInterface[]
  const nowDate = DateTime.now()

  const buildUseCase = (): GetPosts => {
    return new GetPosts(postRepository)
  }

  beforeEach(() => {
    request = {
      filters: [
        {
          type: RepositoryFilterStringTypeOption.POST_TITLE,
          value: 'some-expected-title',
        },
      ],
      sortOption: RepositorySortingOptions.DATE,
      sortCriteria: RepositorySortingCriteria.ASC,
      page: 1,
      postsPerPage: 10,
    }

    const collection = Collection.initializeCollection<PostMeta, PostMeta['type']>()

    collection.addItemFromPersistenceLayer(new TestPostMetaBuilder().build(), 'expected-type')

    post = new TestPostBuilder()
      .withId('expected-post-id')
      .withProducer(Relationship.initializeRelation(
        new TestProducerBuilder()
          .withParentProducer(Relationship.initializeRelation(null))
          .build()
      ))
      .withMeta(collection)
      .build()

    postsWithCount = [
      {
        post,
        postReactions: 1,
        postViews: 10,
        postComments: 1,
      },
    ]
  })

  describe('when everything goes well', () => {
    it('should call to post repository correctly', async () => {
      postRepository.findWithOffsetAndLimit.mockReturnValueOnce(Promise.resolve(postsWithCount))
      postRepository.countPostsWithFilters.mockReturnValueOnce(Promise.resolve(1))

      const useCase = buildUseCase()

      await useCase.get(request)

      expect(postRepository.findWithOffsetAndLimit).toBeCalledWith(
        0,
        10,
        RepositorySortingOptions.DATE,
        RepositorySortingCriteria.ASC,
        [
          {
            type: RepositoryFilterStringTypeOption.POST_TITLE,
            value: 'some-expected-title',
          },
        ]
      )
      expect(postRepository.countPostsWithFilters).toBeCalledWith(
        [
          {
            type: RepositoryFilterStringTypeOption.POST_TITLE,
            value: 'some-expected-title',
          },
        ]
      )
    })

    it('should return correct data', async () => {
      postRepository.findWithOffsetAndLimit.mockReturnValueOnce(Promise.resolve(postsWithCount))
      postRepository.countPostsWithFilters.mockReturnValueOnce(Promise.resolve(1))

      jest.spyOn(GetPostsApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
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
            slug: 'expected-post-slug',
          },
          postComments: 1,
          postViews: 20,
          postReactions: 10,
        }],
        postsNumber: 1,
      })

      const useCase = buildUseCase()

      const posts = await useCase.get(request)

      expect(posts).toStrictEqual({
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

  describe('when there are failures', () => {
    it('should throw exception if page number value is not valid', async () => {
      request = {
        ...request,
        page: 0,
      }

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(GetPostsApplicationException.invalidPageValue())
    })

    it('should throw exception if perPage value is not valid', async () => {
      request = {
        ...request,
        postsPerPage: 1,
      }

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(GetPostsApplicationException.invalidPerPageValue(minPerPage, maxPerPage))
    })

    it('should throw exception if filter type is not valid', async () => {
      request = {
        ...request,
        filters: [
          {
            type: 'wrong-type',
            value: 'some-value',
          },
        ],
      }

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(GetPostsApplicationException.invalidFilterType('wrong-type'))
    })

    it('should throw exception if filter type is not valid', async () => {
      request = {
        ...request,
        filters: [
          {
            type: RepositoryFilterStringTypeOption.POST_TITLE,
            value: '',
          },
        ],
      }

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(GetPostsApplicationException.invalidFilterValue())
    })

    it('should throw exception if sorting criteria value is not valid', async () => {
      request = {
        ...request,
        sortCriteria: 'invalid-criteria',
      }

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(GetPostsApplicationException.invalidSortingCriteria('invalid-criteria'))
    })

    it('should throw exception if sorting option value is not valid', async () => {
      request = {
        ...request,
        sortOption: 'invalid-option',
      }

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(GetPostsApplicationException.invalidSortingOption('invalid-option'))
    })

    it('should throw exception if an unexpected exception occurred', async () => {
      postRepository.findWithOffsetAndLimit.mockImplementationOnce(() => {
        throw Error('Unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.get(request))
        .rejects
        .toStrictEqual(Error('Unexpected error'))
    })
  })
})
