import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { TestPostCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostCommentBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { DateTime } from 'luxon'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { TestPostChildCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostChildCommentBuilder'
import { CreatePostChildComment } from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildComment'
import {
  CreatePostChildCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationRequestDto'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'
import {
  CreatePostChildCommentApplicationException
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationException'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

describe('~/modules/Posts/Application/CreatePostComment/CreatePostComment.ts', () => {
  const postRepositoryInterface = mock<PostRepositoryInterface>()
  const userRepositoryInterface = mock<UserRepositoryInterface>()
  let postComment: PostComment
  let postChildComment: PostChildComment
  const post = mock<Post>()
  let user: User
  const nowDate = DateTime.now()
  let request: CreatePostChildCommentApplicationRequestDto

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

    postChildComment = new TestPostChildCommentBuilder()
      .withComment('expected-post-comment-comment')
      .withParentCommentId('expected-post-comment-id')
      .withId('expected-post-comment-id')
      .withCreatedAt(nowDate)
      .withUserId('expected-user-id')
      .withUpdatedAt(nowDate)
      .withUser(Relationship.initializeRelation(user))
      .withId('expected-post-child-comment-id')
      .build()

    request = {
      userId: 'expected-user-id',
      postId: 'expected-post-id',
      parentCommentId: 'expected-post-comment-id',
      comment: 'expected-comment',
    }
  })

  const buildUseCase = (): CreatePostChildComment => {
    return new CreatePostChildComment(postRepositoryInterface, userRepositoryInterface)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      post.addChildComment.mockReturnValueOnce(postChildComment)
      postRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockResolvedValueOnce(Promise.resolve(user))
    })

    it('should call repositories correctly', async () => {
      const useCase = buildUseCase()

      await useCase.create(request)

      expect(postRepositoryInterface.findById).toBeCalledWith('expected-post-id',
        ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']
      )
      expect(userRepositoryInterface.findById).toBeCalledWith('expected-user-id')
      expect(postRepositoryInterface.createChildComment).toBeCalledWith(postChildComment)
    })

    it('should return the correct data', async () => {
      jest.spyOn(PostChildCommentApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
        comment: 'expected-post-comment-comment',
        createdAt: nowDate.toISO(),
        id: 'expected-post-comment-id',
        parentCommentId: 'expected-post-comment-id',
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
        parentCommentId: 'expected-post-comment-id',
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
        .toStrictEqual(CreatePostChildCommentApplicationException.postNotFound('expected-post-id'))
    })

    it('should throw exception if user is not found', async () => {
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostChildCommentApplicationException.userNotFound('expected-user-id'))
    })

    it('should throw exception if post comment relationship is not loaded', async () => {
      post.addChildComment.mockImplementationOnce(() => {
        throw RelationshipDomainException.relationNotLoaded()
      })
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(RelationshipDomainException.relationNotLoaded())
    })

    it('should throw exception if parent comment is not found', async () => {
      post.addChildComment.mockImplementationOnce(() => {
        throw PostDomainException.parentCommentNotFound('expected-post-comment-id')
      })
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostChildCommentApplicationException.parentCommentNotFound('expected-post-comment-id'))
    })

    it('should throw exception if post comment cannot be added to post', async () => {
      post.addChildComment.mockReturnValueOnce(postChildComment)
      postRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(post))
      postRepositoryInterface.createChildComment.mockImplementationOnce(() => {
        throw Error('Unexpected error')
      })
      userRepositoryInterface.findById.mockReturnValueOnce(Promise.resolve(user))

      const useCase = buildUseCase()

      await expect(useCase.create(request))
        .rejects
        .toStrictEqual(CreatePostChildCommentApplicationException
          .cannotAddChildComment('expected-post-comment-id', 'expected-user-id')
        )
    })
  })
})
