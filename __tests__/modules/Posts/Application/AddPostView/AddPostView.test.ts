import { mock, mockReset } from 'jest-mock-extended'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import { Post } from '~/modules/Posts/Domain/Post'
import { TestPostBuilder } from '~/__tests__/modules/Posts/Domain/TestPostBuilder'
import { User } from '~/modules/Auth/Domain/User'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { AddPostViewApplicationRequest } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationRequest'
import { DateTime, Settings } from 'luxon'
import { TestPostViewBuilder } from '~/__tests__/modules/Posts/Domain/TestPostViewBuilder'
import {
  AddPostViewApplicationException
} from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'

jest.mock('crypto', () => {
  return {
    randomUUID: jest.fn(() => 'expected-post-view-id'),
  }
})

describe('~/modules/Posts/Application/AddPostView/AddPostView.ts', () => {
  const postRepositoryInterface = mock<PostRepositoryInterface>()
  const userRepositoryInterface = mock<UserRepositoryInterface>()
  let post: Post
  let user: User
  let request: AddPostViewApplicationRequest
  let fakeLocal: DateTime
  let postViewBuilder: TestPostViewBuilder

  const buildUseCase = (): AddPostView => {
    return new AddPostView(postRepositoryInterface, userRepositoryInterface)
  }

  beforeEach(() => {
    mockReset(postRepositoryInterface)
    mockReset(userRepositoryInterface)

    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    fakeLocal = DateTime.local(2023, 2, 25, 19, 28, 49, {
      zone: 'Europe/Madrid',
    })

    DateTime.local = jest.fn(() => fakeLocal)
    DateTime.now = jest.fn(() => fakeLocal)

    post = new TestPostBuilder()
      .withId('expected-post-id')
      .build()

    user = new TestUserBuilder()
      .withId('expected-user-id')
      .build()

    request = {
      userId: 'expected-user-id',
      postId: 'expected-post-id',
    }

    postViewBuilder = new TestPostViewBuilder()
      .withPostId('expected-post-id')
      .withUserId('expected-user-id')
      .withCreatedAt(fakeLocal)
      .withId('expected-post-view-id')
  })

  describe('when everything goes well', () => {
    beforeEach(() => {
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
    })

    it('should call to repositories correctly if request includes userId', async () => {
      const useCase = buildUseCase()
      const postView = postViewBuilder.build()

      await useCase.add(request)

      expect(postRepositoryInterface.findById).toBeCalledWith('expected-post-id')
      expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
      expect(postRepositoryInterface.createPostView).toBeCalledWith('expected-post-id', postView)
    })

    it('should call to repositories correctly if request does not include userId', async () => {
      request = {
        postId: 'expected-post-id',
        userId: null,
      }

      const postView = postViewBuilder.withUserId(null).build()

      const useCase = buildUseCase()

      await useCase.add(request)

      expect(postRepositoryInterface.findById).toBeCalledWith('expected-post-id')
      expect(userRepositoryInterface.findById).not.toBeCalled()
      expect(postRepositoryInterface.createPostView).toBeCalledWith('expected-post-id', postView)
    })
  })

  describe('where there are failures', () => {
    it('should throw exception if post is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.add(request))
        .rejects
        .toStrictEqual(AddPostViewApplicationException.postNotFound('expected-post-id'))
    })

    it('should throw exception if user is not found', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.add(request))
        .rejects
        .toStrictEqual(AddPostViewApplicationException.userNotFound('expected-user-id'))
    })

    it('should throw exception if postView cannot be created', async () => {
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
      postRepositoryInterface.createPostView.mockImplementationOnce(() => {
        throw Error('Unexpected error')
      })

      const useCase = buildUseCase()

      await expect(useCase.add(request))
        .rejects
        .toStrictEqual(AddPostViewApplicationException.cannotCreatePostView('expected-post-id'))
    })
  })
})
