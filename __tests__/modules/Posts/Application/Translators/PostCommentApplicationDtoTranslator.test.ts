import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { TestPostCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostCommentBuilder'
import { DateTime, Settings } from 'luxon'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'
import {
  PostCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostCommentApplicationDtoTranslator'

describe('~/modules/Posts/Application/Translators/PostCommentApplicationDtoTranslator.ts', () => {
  let postComment: PostComment
  const nowDate = DateTime.now()

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    postComment = new TestPostCommentBuilder()
      .withComment('expected-post-comment-comment')
      .withPostId('expected-post-id')
      .withId('expected-post-comment-id')
      .withCreatedAt(nowDate)
      .withUserId('expected-user-id')
      .withUpdatedAt(nowDate)
      .withUser(Relationship.initializeRelation(new TestUserBuilder().build()))
      .build()

    jest.spyOn(UserApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
      createdAt: nowDate.toISO(),
      email: 'test-user-email@email.es',
      emailVerified: nowDate.toISO(),
      id: 'test-user-id',
      imageUrl: 'test-user-image',
      language: 'test-user-language',
      name: 'Test User Name',
      updatedAt: nowDate.toISO(),
      username: 'test_user_username',
    })
  })

  it('should translate data correctly', () => {
    const translatedPost = PostCommentApplicationDtoTranslator.fromDomain(postComment)

    expect(translatedPost).toStrictEqual({
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
