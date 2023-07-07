import { mock } from 'jest-mock-extended'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { TestPostCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostCommentBuilder'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import { PostCommentWithCount } from '~/modules/Posts/Domain/PostCommentWithCountInterface'
import { GetPostPostComments } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostComments'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import {
  GetPostPostCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationException'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import {
  PostWithChildCommentCountDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithChildCommentCountDtoTranslator'
import { DateTime } from 'luxon'

describe('~/modules/Posts/Application/GetPostPostComments/GetPostPostComments.ts', () => {
  const postCommentRepository = mock<PostCommentRepositoryInterface>()
  let postComment: PostComment
  let postCommentWithCount: PostCommentWithCount
  const nowDate = DateTime.now()

  const buildUseCase = (): GetPostPostComments => {
    return new GetPostPostComments(postCommentRepository)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      const user = new TestUserBuilder().withId('expected-user-id').build()

      postComment = new TestPostCommentBuilder()
        .withId('expected-post-comment-id')
        .withComment('expected-post-comment-comment')
        .withPostId('expected-post-id')
        .withUserId('expected-user-id')
        .withUser(Relationship.initializeRelation(user))
        .withCreatedAt(nowDate)
        .build()

      postCommentWithCount = {
        postComment,
        childComments: 1,
      }

      postCommentRepository.findWithOffsetAndLimit.mockResolvedValueOnce(Promise.resolve([postCommentWithCount]))
      postCommentRepository.countPostComments.mockReturnValueOnce(Promise.resolve(1))
    })

    it('should call to repository correctly', async () => {
      const useCase = buildUseCase()

      await useCase.get({
        page: 1,
        postId: 'expected-post-id',
        perPage: 20,
      })

      expect(postCommentRepository.findWithOffsetAndLimit).toBeCalledWith('expected-post-id', 0, 20)
      expect(postCommentRepository.countPostComments).toBeCalledWith('expected-post-id')
    })

    it('should return correct data', async () => {
      jest.spyOn(PostWithChildCommentCountDtoTranslator, 'fromDomain').mockReturnValueOnce({
        postComment: {
          postId: 'expected-post-id',
          comment: 'expected-post-comment-comment',
          createdAt: nowDate.toISO(),
          userId: 'expected-user-id',
          user: {
            createdAt: nowDate.toISO(),
            email: 'expected-user-email',
            name: 'expected-user-name',
            emailVerified: nowDate.toISO(),
            updatedAt: nowDate.toISO(),
            imageUrl: null,
            username: 'expected-username',
            language: 'es',
            id: 'expected-user-id',
          },
          updatedAt: nowDate.toISO(),
          id: 'expected-post-comment-id',
        },
        childrenNumber: 1,
      })

      const useCase = buildUseCase()

      const postComments = await useCase.get({
        page: 1,
        postId: 'expected-post-id',
        perPage: 20,
      })

      expect(postComments).toStrictEqual({
        postCommentsWithChildrenCount: [
          {
            childrenNumber: 1,
            postComment: {
              comment: 'expected-post-comment-comment',
              createdAt: nowDate.toISO(),
              id: 'expected-post-comment-id',
              postId: 'expected-post-id',
              updatedAt: nowDate.toISO(),
              user: {
                createdAt: nowDate.toISO(),
                email: 'expected-user-email',
                emailVerified: nowDate.toISO(),
                id: 'expected-user-id',
                imageUrl: null,
                language: 'es',
                name: 'expected-user-name',
                updatedAt: nowDate.toISO(),
                username: 'expected-username',
              },
              userId: 'expected-user-id',
            },
          },
        ],
        postPostCommentsCount: 1,
      })
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if page value is invalid', async () => {
      const useCase = buildUseCase()

      await expect(useCase.get({
        page: 0,
        postId: 'expected-post-id',
        perPage: 20,
      }))
        .rejects
        .toStrictEqual(GetPostPostCommentsApplicationException.invalidOffsetValue())
    })

    it('should throw exception if page value is invalid', async () => {
      const useCase = buildUseCase()

      await expect(useCase.get({
        page: 10,
        postId: 'expected-post-id',
        perPage: 5,
      }))
        .rejects
        .toStrictEqual(GetPostPostCommentsApplicationException.invalidLimitValue(minPerPage, maxPerPage))
    })

    it('should throw exception if unexpected error occurred with persistence layer', async () => {
      postCommentRepository.findWithOffsetAndLimit.mockImplementationOnce(() => { throw Error('unexpected error') })
      const useCase = buildUseCase()

      await expect(useCase.get({
        page: 10,
        postId: 'expected-post-id',
        perPage: 20,
      }))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })
  })
})
