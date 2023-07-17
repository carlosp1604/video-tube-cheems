import { mock } from 'jest-mock-extended'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import {
  DeletePostCommentApplicationRequestDto
} from '~/modules/Posts/Application/DeletePostComment/DeletePostCommentApplicationRequestDto'
import { DeletePostComment } from '~/modules/Posts/Application/DeletePostComment/DeletePostComment'
import {
  DeletePostCommentApplicationException
} from '~/modules/Posts/Application/DeletePostComment/DeletePostCommentApplicationException'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

describe('~/modules/Posts/Application/DeletePostComment/DeletePostComment.ts', () => {
  const postRepositoryInterface = mock<PostRepositoryInterface>()
  const userRepositoryInterface = mock<UserRepositoryInterface>()
  const post = mock<Post>()
  let user: User
  const nowDate = DateTime.now()
  let request: DeletePostCommentApplicationRequestDto

  beforeEach(() => {
    user = new TestUserBuilder()
      .withId('expected-user-id')
      .withEmail('expected-emaild@email.es')
      .withCreatedAt(nowDate)
      .withEmailVerified(nowDate)
      .withImageUrl(null)
      .withName('expected name')
      .withUsername('expected_username')
      .withUpdatedAt(nowDate)
      .withLanguage('expected-language')
      .build()

    request = {
      userId: 'expected-user-id',
      postId: 'expected-post-id',
      postCommentId: 'expected-post-comment-id',
      parentCommentId: null,
    }
  })

  const buildUseCase = (): DeletePostComment => {
    return new DeletePostComment(postRepositoryInterface, userRepositoryInterface)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
    })

    describe('when post comment is a parentComment', () => {
      it('should call to repositories correctly', async () => {
        const useCase = buildUseCase()

        await useCase.delete(request)

        expect(postRepositoryInterface.findById)
          .toBeCalledWith(
            'expected-post-id',
            ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']
          )
        expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
        expect(post.deleteComment).toBeCalledWith('expected-post-comment-id', 'expected-user-id')
        expect(postRepositoryInterface.deleteComment).toBeCalledWith('expected-post-comment-id')
      })
    })

    describe('when post comment is a child comment', () => {
      beforeEach(() => {
        request = {
          ...request,
          parentCommentId: 'expected-post-comment-id',
          postCommentId: 'expected-post-child-comment-id',
        }
      })

      it('should call to repositories correctly', async () => {
        const useCase = buildUseCase()

        await useCase.delete(request)

        expect(postRepositoryInterface.findById)
          .toBeCalledWith(
            'expected-post-id',
            ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']
          )
        expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
        expect(post.deleteChildComment)
          .toBeCalledWith('expected-post-comment-id', 'expected-post-child-comment-id', 'expected-user-id')
        expect(postRepositoryInterface.deleteComment).toBeCalledWith('expected-post-child-comment-id')
      })
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if post does not exist', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostCommentApplicationException.postNotFound('expected-post-id'))
    })

    it('should throw exception if user does not exist', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostCommentApplicationException.userNotFound('expected-user-id'))
    })

    it('should throw exception if post comment does not exists', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))

      post.deleteComment.mockImplementationOnce(() => {
        throw PostDomainException.postCommentNotFound('expected-post-comment-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostCommentApplicationException.postCommentNotFound('expected-post-comment-id'))
    })

    it('should throw exception if user cannot delete comment', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))

      post.deleteComment.mockImplementationOnce(() => {
        throw PostDomainException.userCannotDeleteComment('expected-user-id', 'expected-post-comment-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(
          DeletePostCommentApplicationException.userCannotDeleteComment('expected-user-id', 'expected-post-comment-id')
        )
    })

    it('should throw exception if post comment cannot be deleted', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))

      post.deleteComment.mockImplementationOnce(() => {
        throw PostDomainException.cannotDeleteComment('expected-post-comment-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(
          DeletePostCommentApplicationException.cannotDeleteComment('expected-post-comment-id')
        )
    })

    it('should throw exception if unexpected error occurred', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))

      post.deleteComment.mockImplementationOnce(() => {
        throw Error('unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })

    it('should throw exception if parent comment does not exist', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))

      request = {
        ...request,
        parentCommentId: 'expected-post-comment-id',
        postCommentId: 'expected-post-child-comment-id',
      }

      post.deleteChildComment.mockImplementationOnce(() => {
        throw PostDomainException.parentCommentNotFound('expected-post-comment-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostCommentApplicationException.parentCommentNotFound('expected-post-comment-id'))
    })

    it('should throw exception cannot delete comment from persistence layer', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      postRepositoryInterface.deleteComment.mockImplementationOnce(() => {
        throw Error('unexpected persistence error')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(
          DeletePostCommentApplicationException.cannotDeleteCommentFromPersistence('expected-post-comment-id')
        )
    })
  })
})
