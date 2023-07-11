import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { CreatePostComment } from '~/modules/Posts/Application/CreatePostComment/CreatePostComment'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { TestPostCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostCommentBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { DateTime } from 'luxon'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import {
  CreatePostCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationRequestDto'
import {
  PostCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostCommentApplicationDtoTranslator'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'

describe('~/modules/Posts/Application/CreatePostComment/CreatePostComment.ts', () => {
  const postRepositoryInterface = mock<PostRepositoryInterface>()
  const userRepositoryInterface = mock<UserRepositoryInterface>()
  let postComment: PostComment
  const post = mock<Post>()
  let user: User
  const nowDate = DateTime.now()
  let request: CreatePostCommentApplicationRequestDto

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

    postComment = new TestPostCommentBuilder()
      .withComment('expected-post-comment-comment')
      .withPostId('expected-post-id')
      .withId('expected-post-comment-id')
      .withCreatedAt(nowDate)
      .withUserId('expected-user-id')
      .withUpdatedAt(nowDate)
      .withUser(Relationship.initializeRelation(user))
      .build()

    request = {
      userId: 'expected-user-id',
      postId: 'expected-post-id',
      comment: 'expected-comment',
    }
  })

  const buildUseCase = (): CreatePostComment => {
    return new CreatePostComment(postRepositoryInterface, userRepositoryInterface)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      post.addComment.mockReturnValueOnce(postComment)
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
    })

    it('should call repositories correctly', async () => {
      const useCase = buildUseCase()

      await useCase.create(request)

      expect(postRepositoryInterface.findById).toBeCalledWith('expected-post-id', ['comments', 'comments.user'])
      expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
      expect(postRepositoryInterface.createComment).toBeCalledWith(postComment)
    })

    it('should return the correct data', async () => {
      jest.spyOn(PostCommentApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
        comment: 'expected-post-comment-comment',
        createdAt: nowDate.toISO(),
        id: 'expected-post-comment-id',
        postId: 'expected-post-id',
        updatedAt: nowDate.toISO(),
        user: {
          createdAt: nowDate.toISO(),
          email: 'test-user-email@email.es',
          emailVerified: nowDate.toISO(),
          id: 'test-user-id',
          imageUrl: 'test-user-image',
          language: 'test-user-language',
          name: 'Test User Name',
          updatedAt: nowDate.toISO(),
          username: 'test_user_username',
        },
        userId: 'expected-user-id',
      })

      const useCase = buildUseCase()

      const createdPostComment = await useCase.create(request)

      expect(createdPostComment).toStrictEqual({
        comment: 'expected-post-comment-comment',
        createdAt: nowDate.toISO(),
        id: 'expected-post-comment-id',
        postId: 'expected-post-id',
        updatedAt: nowDate.toISO(),
        user: {
          createdAt: nowDate.toISO(),
          email: 'test-user-email@email.es',
          emailVerified: nowDate.toISO(),
          id: 'test-user-id',
          imageUrl: 'test-user-image',
          language: 'test-user-language',
          name: 'Test User Name',
          updatedAt: nowDate.toISO(),
          username: 'test_user_username',
        },
        userId: 'expected-user-id',
      })
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if post is not found', async () => {
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostCommentApplicationException.postNotFound('expected-post-id'))
    })

    it('should throw exception if user is not found', async () => {
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostCommentApplicationException.userNotFound('expected-user-id'))
    })

    it('should throw exception if post comment relationship is not loaded', async () => {
      post.addComment.mockImplementationOnce(() => {
        throw RelationshipDomainException.relationNotLoaded()
      })
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(RelationshipDomainException.relationNotLoaded())
    })

    it('should throw exception if post comment cannot be added to post', async () => {
      post.addComment.mockReturnValueOnce(postComment)
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      postRepositoryInterface.createComment.mockImplementationOnce(() => {
        throw Error('Unexpected error')
      })
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostCommentApplicationException.cannotAddComment('expected-post-id', 'expected-user-id'))
    })
  })
})
