import { DateTime, Settings } from 'luxon'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Auth/Domain/TestVerificationTokenBuilder'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import {
  VerificationTokenApplicationDtoTranslator
} from '~/modules/Auth/Application/Translators/VerificationTokenApplicationDtoTranslator'

describe('~/modules/Auth/Application/Translators/VerificationTokenApplicationDtoTranslator.ts', () => {
  let verificationToken: VerificationToken
  const nowDate = DateTime.now()

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    verificationToken = new TestVerificationTokenBuilder()
      .withId('test-user-id')
      .withUserEmail('test-user-email@email.es')
      .withToken('expected-token')
      .withCreatedAt(nowDate)
      .withExpiresAt(nowDate.plus({ minute: 30 }))
      .withType(VerificationTokenType.CREATE_ACCOUNT)
      .build()
  })

  it('should translate data correctly', () => {
    const translation = VerificationTokenApplicationDtoTranslator.fromDomain(verificationToken)

    expect(translation).toStrictEqual({
      userEmail: 'test-user-email@email.es',
      id: 'test-user-id',
      token: 'expected-token',
      expiresAt: nowDate.plus({ minute: 30 }).toISO(),
      type: VerificationTokenType.CREATE_ACCOUNT,
    })
  })
})
