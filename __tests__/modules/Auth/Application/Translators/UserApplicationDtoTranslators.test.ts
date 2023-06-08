import { TestUserBuilder } from '~/__tests__/modules/Domain/TestUserBuilder'
import { DateTime, Settings } from 'luxon'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'

describe('~/modules/Auth/Application/Translators/UserApplicationDtoTranslator.ts', () => {
  let testUserBuilder: TestUserBuilder
  const nowDate = DateTime.now()

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    testUserBuilder = new TestUserBuilder()
      .withId('test-user-id')
      .withName('Test User Name')
      .withUsername('test_user_username')
      .withEmail('test-user-email@email.es')
      .withImageUrl('test-user-image')
      .withPassword('test-user-password')
      .withCreatedAt(nowDate)
      .withUpdatedAt(nowDate)
      .withEmailVerified(nowDate)
  })

  it('should translate data correctly', () => {
    const user = testUserBuilder.build()

    const translation = UserApplicationDtoTranslator.fromDomain(user)

    expect(translation).toStrictEqual({
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

  it('should handle nullish properties correctly', () => {
    const user = testUserBuilder
      .withImageUrl(null)
      .withEmailVerified(null)
      .build()

    const translation = UserApplicationDtoTranslator.fromDomain(user)

    expect(translation).toStrictEqual({
      createdAt: nowDate.toISO(),
      email: 'test-user-email@email.es',
      emailVerified: null,
      id: 'test-user-id',
      imageUrl: null,
      language: 'test-user-language',
      name: 'Test User Name',
      updatedAt: nowDate.toISO(),
      username: 'test_user_username',
    })
  })
})
