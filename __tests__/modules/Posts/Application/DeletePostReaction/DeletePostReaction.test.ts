import { mock, mockReset } from 'jest-mock-extended'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { User } from '~/modules/Auth/Domain/User'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import {
  DeletePostReactionApplicationRequestDto
} from '~/modules/Posts/Application/DeletePostReaction/DeletePostReactionApplicationRequestDto'
import { DeletePostReaction } from '~/modules/Posts/Application/DeletePostReaction/DeletePostReaction'
import {
  DeletePostReactionApplicationException
} from '~/modules/Posts/Application/DeletePostReaction/DeletePostReactionApplicationException'

describe('~/modules/Posts/Application/DeletePostReaction/DeletePostReaction.ts', () => {
  const postRepositoryInterface = mock<PostRepositoryInterface>()
  const userRepositoryInterface = mock<UserRepositoryInterface>()
  let user: User
  const post = mock<Post>({
    id: 'expected-post-id',
  })

  let request: DeletePostReactionApplicationRequestDto

  const buildUseCase = (): DeletePostReaction => {
    return new DeletePostReaction(postRepositoryInterface, userRepositoryInterface)
  }

  beforeEach(() => {
    mockReset(postRepositoryInterface)
    mockReset(userRepositoryInterface)

    user = new TestUserBuilder()
      .withId('expected-user-id')
      .build()

    request = {
      userId: 'expected-user-id',
      postId: 'expected-post-id',
    }
  })

  describe('when everything goes well', () => {
    beforeEach(() => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))
      post.deleteReaction.mockReturnValueOnce()
    })

    it('should call to repositories correctly', async () => {
      const useCase = buildUseCase()

      await useCase.delete(request)

      expect(postRepositoryInterface.findById).toBeCalledWith('expected-post-id', ['reactions'])
      expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
      expect(post.deleteReaction).toBeCalledWith('expected-user-id')
      expect(postRepositoryInterface.deleteReaction).toBeCalledWith('expected-user-id', 'expected-post-id')
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if post is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostReactionApplicationException.postNotFound('expected-post-id'))
    })

    it('should throw exception if user is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostReactionApplicationException.userNotFound('expected-user-id'))
    })

    it('should throw exception if post reaction is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.deleteReaction.mockImplementationOnce(() => {
        throw PostDomainException.userHasNotReacted('expected-user-id', 'expected-post-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(DeletePostReactionApplicationException.userHasNotReacted('expected-user-id', 'expected-post-id'))
    })

    it('should throw exception if unexpected error occurred while trying to remove reaction from post', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.deleteReaction.mockImplementationOnce(() => {
        throw Error('unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })

    it('should throw exception if unexpected exception occurred while trying to persist reaction', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.deleteReaction.mockReturnValueOnce()
      postRepositoryInterface.deleteReaction.mockImplementationOnce(() => {
        throw Error('unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.delete(request))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })
  })
})
