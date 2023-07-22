import { mock, mockReset } from 'jest-mock-extended'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { User } from '~/modules/Auth/Domain/User'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostReaction, Reaction } from '~/modules/Posts/Domain/PostReaction'
import { TestPostReactionBuilder } from '~/__tests__/modules/Posts/Domain/TestPostReactionBuilder'
import { DateTime } from 'luxon'
import {
  CreatePostReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationRequest'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import {
  CreatePostReactionApplicationException
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationException'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

describe('~/modules/Posts/Application/CreatePostReaction/CreatePostReaction.ts', () => {
  const postRepositoryInterface = mock<PostRepositoryInterface>()
  const userRepositoryInterface = mock<UserRepositoryInterface>()
  let user: User
  let postReaction: PostReaction
  const post = mock<Post>()
  const nowDate = DateTime.now()
  let request: CreatePostReactionApplicationRequest

  const buildUseCase = (): CreatePostReaction => {
    return new CreatePostReaction(postRepositoryInterface, userRepositoryInterface)
  }

  beforeEach(() => {
    mockReset(postRepositoryInterface)
    mockReset(userRepositoryInterface)

    user = new TestUserBuilder()
      .withId('expected-user-id')
      .build()

    postReaction = new TestPostReactionBuilder()
      .withPostId('expected-post-id')
      .withReactionType(Reaction.LIKE)
      .withUserId('expected-user-id')
      .withCreatedAt(nowDate)
      .build()

    request = {
      userId: 'expected-user-id',
      postId: 'expected-post-id',
      reactionType: 'like',
    }
  })

  describe('when everything goes well', () => {
    beforeEach(() => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))
      post.addReaction.mockReturnValueOnce(postReaction)
    })

    it('should call to repositories correctly', async () => {
      const useCase = buildUseCase()

      const spy = jest.spyOn(PostReactionApplicationDtoTranslator, 'fromDomain')

      await useCase.create(request)

      expect(postRepositoryInterface.findById).toBeCalledWith('expected-post-id', ['reactions', 'reactions.user'])
      expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
      expect(post.addReaction).toBeCalledWith('expected-user-id', 'like')
      expect(postRepositoryInterface.createReaction).toBeCalledWith(postReaction)
      expect(spy).toBeCalledWith(postReaction)
    })

    it('should call to repositories correctly', async () => {
      const useCase = buildUseCase()

      jest.spyOn(PostReactionApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
        userId: 'expected-user-id',
        postId: 'expected-post-id',
        reactionType: 'like',
      })

      const returnedReaction = await useCase.create(request)

      expect(returnedReaction).toStrictEqual({
        userId: 'expected-user-id',
        postId: 'expected-post-id',
        reactionType: 'like',
      })
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if post is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostReactionApplicationException.postNotFound('expected-post-id'))
    })

    it('should throw exception if user is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostReactionApplicationException.userNotFound('expected-user-id'))
    })

    it('should throw exception if cannot add reaction to post', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.addReaction.mockImplementationOnce(() => {
        throw PostDomainException.cannotAddReaction('expected-user-id', 'expected-post-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostReactionApplicationException.cannotAddReaction('expected-user-id', 'expected-post-id'))
    })

    it('should throw exception if user already reacted to post', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.addReaction.mockImplementationOnce(() => {
        throw PostDomainException.userAlreadyReacted('expected-user-id', 'expected-post-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(
          CreatePostReactionApplicationException.userAlreadyReacted('expected-user-id', 'expected-post-id')
        )
    })

    it('should throw exception if unexpected exception occurred', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.addReaction.mockImplementationOnce(() => {
        throw Error('unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })

    it('should throw exception if unexpected exception occurred while trying to persist reaction', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      post.addReaction.mockReturnValueOnce(postReaction)
      postRepositoryInterface.createReaction.mockImplementationOnce(() => {
        throw Error('unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(Error('unexpected error'))
    })
  })
})
