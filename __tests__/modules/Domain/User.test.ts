import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { TestUserBuilder } from '~/__tests__/modules/Domain/TestUserBuilder'
import { BcryptCryptoService } from '~/helpers/Infrastructure/BcryptCryptoService'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

jest.mock('crypto', () => {
  return {
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(() => 'expected-installation-id'),
  }
})

describe('~/modules/Auth/Domain/User.ts', () => {
  let user: User
  const nowDate: DateTime = DateTime.now()

  const createUser = (
    invalidEmail = false,
    invalidUsername = false
  ): User => {
    return new User(
      'test-user-id',
      'test-user-name',
      invalidUsername ? '-invalid!username' : 'valid_username123',
      invalidEmail ? 'user@test' : 'user@test.com',
      null,
      'es',
      'no-hashed-test-user-password',
      nowDate,
      nowDate,
      nowDate,
      null
    )
  }

  describe('isAccountActive method', () => {
    it('should return true if user email is verified', () => {
      user = new TestUserBuilder()
        .withEmailVerified(DateTime.now())
        .build()

      const isActiveAccount = user.isAccountActive()

      expect(isActiveAccount).toBe(true)
    })

    it('should return false if user email is not verified', () => {
      user = new TestUserBuilder()
        .withEmailVerified(null)
        .build()

      const isActiveAccount = user.isAccountActive()

      expect(isActiveAccount).toBe(false)
    })
  })

  describe('matchPasswords method', () => {
    it('should return true if provided password and user password matches', async () => {
      const hashedPassword = await (new BcryptCryptoService()).hash('password')

      user = new TestUserBuilder()
        .withPassword(hashedPassword)
        .build()

      const passwordsMatches = await user.matchPasswords('password')

      expect(passwordsMatches).toBe(true)
    })

    it('should return false if provided password and user password does not match', async () => {
      const hashedPassword = await (new BcryptCryptoService()).hash('password')

      user = new TestUserBuilder()
        .withPassword(hashedPassword)
        .build()

      const passwordsMatches = await user.matchPasswords('another-password')

      expect(passwordsMatches).toBe(false)
    })
  })

  describe('constructor method', () => {
    it('should throw exception if email is not valid', async () => {
      expect(() => { createUser(true) })
        .toThrow(ValidationException.invalidEmail('user@test'))
    })

    it('should throw exception if username is not valid', async () => {
      expect(() => { createUser(false, true) })
        .toThrow(ValidationException.invalidUsername('-invalid!username'))
    })

    it('should not throw exception if input data is valid', async () => {
      expect(() => { createUser() })
        .not.toThrow()
    })
  })
})
