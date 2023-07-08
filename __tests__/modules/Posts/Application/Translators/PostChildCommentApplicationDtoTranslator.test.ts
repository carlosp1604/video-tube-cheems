import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { DateTime, Settings } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'
import { TestPostChildCommentBuilder } from '~/__tests__/modules/Posts/Domain/TestPostChildCommentBuilder'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'

describe('~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator.ts', () => {
  let postChildComment: PostChildComment
  const nowDate = DateTime.now()

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    postChildComment = new TestPostChildCommentBuilder()
      .withComment('expected-post-child-comment-comment')
      .withParentCommentId('expected-parent-comment-id')
      .withId('expected-post-child-comment-id')
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
    const translatedPost = PostChildCommentApplicationDtoTranslator.fromDomain(postChildComment)

    expect(translatedPost).toStrictEqual({
      comment: 'expected-post-child-comment-comment',
      createdAt: nowDate.toISO(),
      id: 'expected-post-child-comment-id',
      parentCommentId: 'expected-parent-comment-id',
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
