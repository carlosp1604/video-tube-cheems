import { User } from '~/modules/Auth/Domain/User'
import { DateTime, Settings } from 'luxon'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { BcryptCryptoService } from '~/helpers/Infrastructure/BcryptCryptoService'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Auth/Domain/TestVerificationTokenBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'
import { mock } from 'jest-mock-extended'

jest.mock('crypto', () => {
  return {
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(() => 'expected-id'),
  }
})

describe('~/modules/Auth/Domain/User.ts', () => {
  let user: User
  const nowDate: DateTime = DateTime.now()

  const createUser = (
    invalidEmail = false,
    invalidUsername = false,
    invalidName = false
  ): User => {
    return new User(
      'test-user-id',
      invalidName ? 'invalid-test-user-name' : 'Valid User Name',
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

    it('should throw exception if username is not valid', async () => {
      expect(() => { createUser(false, false, true) })
        .toThrow(ValidationException.invalidName('invalid-test-user-name'))
    })

    it('should not throw exception if input data is valid', async () => {
      expect(() => { createUser() })
        .not.toThrow()
    })
  })

  describe('setVerificationToken method', () => {
    let testUserBuilder: TestUserBuilder
    let testVerificationTokenBuilder: TestVerificationTokenBuilder
    let fakeLocal: DateTime

    beforeEach(() => {
      Settings.defaultLocale = 'es-ES'
      Settings.defaultZone = 'Europe/Madrid'

      fakeLocal = DateTime.local(2023, 2, 25, 19, 28, 49, {
        zone: 'Europe/Madrid',
      })

      DateTime.local = jest.fn(() => fakeLocal)
      DateTime.now = jest.fn(() => fakeLocal)

      testUserBuilder = new TestUserBuilder()
        .withId('test-user-id')
        .withEmail('test-user@email.es')

      testVerificationTokenBuilder = new TestVerificationTokenBuilder()
        .withToken('expected-token')
        .withId('expected-id')
        .withExpiresAt(fakeLocal.plus({ minute: 30 }))
        .withCreatedAt(fakeLocal)
        .withUserEmail('test-user@email.es')

      jest.spyOn(BcryptCryptoService.prototype, 'randomString').mockReturnValueOnce('expected-token')
    })

    it('should throw exception if token is create-account type', () => {
      const user = testUserBuilder.build()

      expect(() => user.setVerificationToken(VerificationTokenType.CREATE_ACCOUNT, false))
        .toThrowError(UserDomainException.cannotAddVerificationTokenToAccountCreation('test-user-id'))
    })

    it('should throw exception if user has an active token and renovateToken flag is set to false', () => {
      const verificationToken = testVerificationTokenBuilder.build()
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      expect(() => user.setVerificationToken(VerificationTokenType.RETRIEVE_PASSWORD, false))
        .toThrowError(UserDomainException.userHasAlreadyAnActiveToken('test-user-id'))
    })

    it('should throw exception if cannot update relationship', () => {
      const verificationToken = testVerificationTokenBuilder.build()
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      jest.spyOn(Relationship.prototype, 'updateRelationship').mockReturnValueOnce(false)

      expect(() => user.setVerificationToken(VerificationTokenType.RETRIEVE_PASSWORD, true))
        .toThrowError(UserDomainException.cannotAddVerificationToken('test-user-id'))
    })

    it('should throw exception if unexpected error occurred', () => {
      const verificationToken = testVerificationTokenBuilder.build()
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      jest.spyOn(Relationship.prototype, 'value', 'get').mockImplementationOnce(() => {
        throw Error('Something went wrong')
      })

      expect(() => user.setVerificationToken(VerificationTokenType.RETRIEVE_PASSWORD, true))
        .toThrowError(Error('Something went wrong'))
    })

    it('should create token correctly', () => {
      const verificationToken = testVerificationTokenBuilder.build()
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      const token = user.setVerificationToken(VerificationTokenType.RETRIEVE_PASSWORD, true)

      expect(token.id).toStrictEqual('expected-id')
      expect(token.expiresAt).toStrictEqual(fakeLocal.plus({ minute: 30 }))
      expect(token.createdAt).toStrictEqual(fakeLocal)
      expect(token.type).toStrictEqual(VerificationTokenType.RETRIEVE_PASSWORD)
      expect(token.userEmail).toStrictEqual('test-user@email.es')
    })
  })

  describe('removeVerificationToken method', () => {
    let testUserBuilder: TestUserBuilder
    let verificationToken: VerificationToken

    beforeEach(() => {
      testUserBuilder = new TestUserBuilder()
        .withId('test-user-id')
        .withEmail('test-user@email.es')

      verificationToken = new TestVerificationTokenBuilder()
        .withToken('expected-token')
        .withId('expected-id')
        .withUserEmail('test-user@email.es')
        .build()
    })

    it('should throw exception if relation is not loaded', () => {
      const user = testUserBuilder
        .build()

      expect(() => user.removeVerificationToken())
        .toThrowError(RelationshipDomainException.relationNotLoaded())
    })

    it('should throw exception if token cannot be removed', () => {
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      jest.spyOn(Relationship.prototype, 'removeRelationship').mockReturnValueOnce(false)

      expect(() => user.removeVerificationToken())
        .toThrowError(UserDomainException.cannotRemoveVerificationToken('test-user-id'))
    })

    it('should remove token correctly', () => {
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      jest.spyOn(Relationship.prototype, 'removeRelationship').mockReturnValueOnce(true)

      expect(() => user.removeVerificationToken())
        .not.toThrow()
    })
  })

  describe('assertVerificationTokenIsValidFor method', () => {
    let testUserBuilder: TestUserBuilder
    const verificationToken = mock<VerificationToken>({
      id: 'test-verification-token-id',
      token: 'test-token',
    })

    beforeEach(() => {
      testUserBuilder = new TestUserBuilder()
        .withId('test-user-id')
        .withEmail('test-user@email.es')
    })

    it('should throw exception if relation is not loaded', () => {
      const user = testUserBuilder
        .build()

      expect(() => user.assertVerificationTokenIsValidFor(VerificationTokenType.RETRIEVE_PASSWORD, 'test-token'))
        .toThrowError(RelationshipDomainException.relationNotLoaded())
    })

    it('should throw exception if user has not a verification token', () => {
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(null))
        .build()

      expect(() => user.assertVerificationTokenIsValidFor(VerificationTokenType.RETRIEVE_PASSWORD, 'test-token'))
        .toThrowError(UserDomainException.userHasNotAVerificationToken('test-user-id'))
    })

    it('should throw exception if token is not valid', () => {
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      verificationToken.isTokenValidFor.mockReturnValueOnce(false)

      expect(() => user.assertVerificationTokenIsValidFor(VerificationTokenType.RETRIEVE_PASSWORD, 'test-token'))
        .toThrowError(UserDomainException.verificationTokenIsNotValidFor(
          'test-verification-token-id', VerificationTokenType.RETRIEVE_PASSWORD
        ))
    })

    it('should not throw if token is valid', () => {
      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      verificationToken.isTokenValidFor.mockReturnValueOnce(true)
      verificationToken.valueMatches.mockReturnValueOnce(true)

      expect(() => user.assertVerificationTokenIsValidFor(VerificationTokenType.RETRIEVE_PASSWORD, 'test-token'))
        .not.toThrow()
    })
  })
})
