import { mock } from 'jest-mock-extended'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import { DateTime } from 'luxon'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { TestPostChildCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostChildCommentBuilder'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'
import {
  GetPostPostChildCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationException'

describe('~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments.ts', () => {
  const postCommentRepository = mock<PostCommentRepositoryInterface>()
  let postChildComment: PostChildComment
  const nowDate = DateTime.now()

  const buildUseCase = (): GetPostPostChildComments => {
    return new GetPostPostChildComments(postCommentRepository)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      const user = new TestUserBuilder().withId('expected-user-id').build()

      postChildComment = new TestPostChildCommentBuilder()
        .withId('expected-post-child-comment-id')
        .withComment('expected-post-child-comment-comment')
        .withParentCommentId('expected-parent-comment-id')
        .withUserId('expected-user-id')
        .withUser(Relationship.initializeRelation(user))
        .withCreatedAt(nowDate)
        .build()

      postCommentRepository.findChildsWithOffsetAndLimit.mockResolvedValueOnce(Promise.resolve([postChildComment]))
      postCommentRepository.countPostChildComments.mockReturnValueOnce(Promise.resolve(1))
    })

    it('should call to repository correctly', async () => {
      const useCase = buildUseCase()

      await useCase.get({
        page: 1,
        parentCommentId: 'expected-parent-comment-id',
        perPage: 20,
      })

      expect(postCommentRepository.findChildsWithOffsetAndLimit).toBeCalledWith('expected-parent-comment-id', 0, 20)
      expect(postCommentRepository.countPostChildComments).toBeCalledWith('expected-parent-comment-id')
    })

    it('should return correct data', async () => {
      jest.spyOn(PostChildCommentApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
        id: 'expected-post-child-comment-id',
        userId: 'expected-user-id',
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
        updatedAt: nowDate.toISO(),
        createdAt: nowDate.toISO(),
        parentCommentId: 'expected-parent-comment-id',
        comment: 'expected-post-child-comment-comment',
      })

      const useCase = buildUseCase()

      const postComments = await useCase.get({
        page: 1,
        parentCommentId: 'expected-parent-comment-id',
        perPage: 20,
      })

      expect(postComments).toStrictEqual({
        childComments: [
          {
            comment: 'expected-post-child-comment-comment',
            createdAt: nowDate.toISO(),
            id: 'expected-post-child-comment-id',
            parentCommentId: 'expected-parent-comment-id',
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
        ],
        childCommentsCount: 1,
      })
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if page value is invalid', async () => {
      const useCase = buildUseCase()

      await expect(useCase.get({
        page: 0,
        parentCommentId: 'expected-parent-comment-id',
        perPage: 20,
      }))
        .rejects
        .toStrictEqual(GetPostPostChildCommentsApplicationException.invalidPageValue())
    })

    it('should throw exception if page value is invalid', async () => {
      const useCase = buildUseCase()

      await expect(useCase.get({
        page: 10,
        parentCommentId: 'expected-parent-comment-id',
        perPage: 5,
      }))
        .rejects
        .toStrictEqual(GetPostPostChildCommentsApplicationException.invalidPerPageValue(minPerPage, maxPerPage))
    })

    it('should throw exception if unexpected error occurred with persistence layer', async () => {
      postCommentRepository.findChildsWithOffsetAndLimit.mockImplementationOnce(
        () => { throw Error('unexpected error') }
      )
      const useCase = buildUseCase()

      await expect(useCase.get({
        page: 10,
        parentCommentId: 'expected-parent-comment-id',

        perPage: 20,
      }))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })
  })
})
