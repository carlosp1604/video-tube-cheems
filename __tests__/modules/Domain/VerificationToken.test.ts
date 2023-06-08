import { DateTime } from 'luxon'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { VerificationTokenDomainException } from '~/modules/Auth/Domain/VerificationTokenDomainException'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Domain/TestVerificationTokenBuilder'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

describe('~/modules/Auth/Domain/VerificationToken.ts', () => {
  describe('tokenHasExpired method', () => {
    it('should return true if token has expired', async () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withExpiresAt(DateTime.now().minus({ seconds: 10 }))
        .build()

      const tokenHasExpired = verificationToken.tokenHasExpired()

      expect(tokenHasExpired).toStrictEqual(true)
    })

    it('should return true if token has expired', async () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withExpiresAt(DateTime.now().plus({ seconds: 10 }))
        .build()

      const tokenHasExpired = verificationToken.tokenHasExpired()

      expect(tokenHasExpired).toStrictEqual(false)
    })
  })

  describe('constructor method', () => {
    const createVerificationToken = (
      invalidEmail: boolean,
      invalidType: boolean
    ): VerificationToken => {
      return new VerificationToken(
        'test-token-id',
        'test-token',
        invalidEmail ? 'user@test' : 'user@test.com',
        invalidType ? 'notvalidtype' : VerificationTokenType.CREATE_ACCOUNT,
        DateTime.now(),
        DateTime.now()
      )
    }

    it('should throw exception if user email is not valid', async () => {
      expect(() => { createVerificationToken(true, false) })
        .toThrow(ValidationException.invalidEmail('user@test'))
    })

    it('should throw exception if verification token type is not valid', async () => {
      expect(() => { createVerificationToken(false, true) })
        .toThrow(VerificationTokenDomainException.invalidVerificationTokenType('notvalidtype'))
    })

    it('should not throw exception if input data is valid', async () => {
      expect(() => { createVerificationToken(false, false) })
        .not.toThrow()
    })
  })

  describe('isTokenValidFor method', () => {
    it('should return false if token is expired', () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withExpiresAt(DateTime.now().minus({ seconds: 30 }))
        .withType(VerificationTokenType.CREATE_ACCOUNT)
        .build()

      expect(verificationToken.isTokenValidFor(VerificationTokenType.CREATE_ACCOUNT))
        .toStrictEqual(false)
    })

    it('should return false if token is not required type', () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withExpiresAt(DateTime.now().plus({ seconds: 30 }))
        .withType(VerificationTokenType.RETRIEVE_PASSWORD)
        .build()

      expect(verificationToken.isTokenValidFor(VerificationTokenType.CREATE_ACCOUNT))
        .toStrictEqual(false)
    })

    it('should return true if token is valid', () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withExpiresAt(DateTime.now().plus({ seconds: 30 }))
        .withType(VerificationTokenType.RETRIEVE_PASSWORD)
        .build()

      expect(verificationToken.isTokenValidFor(VerificationTokenType.RETRIEVE_PASSWORD))
        .toStrictEqual(true)
    })
  })

  describe('valueMatches method', () => {
    it('should return false if token does not match', () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withToken('expected-token')
        .build()

      expect(verificationToken.valueMatches('another-token'))
        .toStrictEqual(false)
    })

    it('should return false if token matches', () => {
      const verificationToken = new TestVerificationTokenBuilder()
        .withToken('expected-token')
        .build()

      expect(verificationToken.valueMatches('expected-token'))
        .toStrictEqual(true)
    })
  })
})
