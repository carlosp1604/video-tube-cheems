import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { mock, mockReset } from 'jest-mock-extended'
import { VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { DateTime, Settings } from 'luxon'
import {
  ValidateTokenApplicationRequestInterface
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationRequestInterface'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken/ValidateToken'
import {
  ValidateTokenApplicationException
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationException'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Domain/TestVerificationTokenBuilder'
import { TestUserBuilder } from '~/__tests__/modules/Domain/TestUserBuilder'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'

jest.mock('crypto', () => {
  return {
    randomUUID: jest.fn(() => 'expected-id'),
  }
})

describe('~/modules/Auth/Application/ValidateCode/ValidateCode.ts', () => {
  let validateTokenRequest: ValidateTokenApplicationRequestInterface
  const userRepository = mock<UserRepositoryInterface>()
  const verificationTokenRepository = mock<VerificationTokenRepositoryInterface>()
  let testVerificationTokenBuilder: TestVerificationTokenBuilder
  let fakeLocal: DateTime
  let testUserBuilder: TestUserBuilder

  const buildUseCase = () => {
    return new ValidateToken(userRepository, verificationTokenRepository)
  }

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    fakeLocal = DateTime.local(2020, 2, 25, 19, 28, 49, {
      zone: 'Europe/Madrid',
    })

    DateTime.local = jest.fn(() => fakeLocal)
    DateTime.now = jest.fn(() => fakeLocal)

    mockReset(userRepository)
    mockReset(verificationTokenRepository)

    validateTokenRequest = {
      userEmail: 'test-user@test.es',
      token: 'expected-request-token',
    }

    testVerificationTokenBuilder = new TestVerificationTokenBuilder()
      .withExpiresAt(fakeLocal.plus({ minute: 30 }))
      .withType(VerificationTokenType.CREATE_ACCOUNT)
      .withUserEmail('test-user@test.es')

    testUserBuilder = new TestUserBuilder()
      .withId('test-user-id')
      .withEmail('test-user@test.es')
  })

  describe('when everything goes well', () => {
    it('should call to repositories and services correctly when verification is create-account type', async () => {
      const verificationToken = testVerificationTokenBuilder.build()

      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

      const useCase = buildUseCase()

      await useCase.validate(validateTokenRequest)

      expect(userRepository.findByEmail).toBeCalledWith('test-user@test.es', ['verificationToken'])
      expect(verificationTokenRepository.findByEmailAndToken)
        .toBeCalledWith('test-user@test.es', 'expected-request-token')
    })

    it('should call to repositories and services correctly when verification is retrieve-password type', async () => {
      const verificationToken = testVerificationTokenBuilder
        .withType(VerificationTokenType.RETRIEVE_PASSWORD)
        .withUserEmail('test-user@test.es')
        .withToken('expected-request-token')
        .withExpiresAt(fakeLocal.plus({ minute: 30 }))
        .build()

      const user = testUserBuilder
        .withVerificationToken(Relationship.initializeRelation(verificationToken))
        .build()

      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      const useCase = buildUseCase()

      await useCase.validate(validateTokenRequest)

      expect(userRepository.findByEmail).toBeCalledWith('test-user@test.es', ['verificationToken'])
    })

    it('should return the correct response', async () => {
      const verificationToken = testVerificationTokenBuilder
        .withId('test-verification-token-id')
        .withToken('expected-request-token')
        .withExpiresAt(fakeLocal.plus({ minute: 30 }))
        .build()

      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

      const useCase = buildUseCase()

      const response = await useCase.validate(validateTokenRequest)

      expect(response).toStrictEqual({
        expiresAt: fakeLocal.plus({ minute: 30 }).toISO(),
        id: 'test-verification-token-id',
        token: 'expected-request-token',
        type: 'create-account',
        userEmail: 'test-user@test.es',
      })
    })
  })

  describe('when there are failures', () => {
    describe('when token is create-account type', () => {
      it('should throw exception if user does exist', async () => {
        const verificationToken = testVerificationTokenBuilder.build()

        const user = testUserBuilder
          .withVerificationToken(Relationship.initializeRelation(verificationToken))
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseRecoverPasswordToken('test-user@test.es'))
      })

      it('should throw exception if verification token does not exist', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(null))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.verificationTokenNotFound('test-user@test.es'))
      })

      it('should throw exception if verification token has expired', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

        const verificationToken = testVerificationTokenBuilder
          .withExpiresAt(fakeLocal.minus({ second: 30 }))
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseCreateAccountToken('test-user@test.es'))
      })

      it('should throw exception if verification token is not create-account type', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

        const verificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseCreateAccountToken('test-user@test.es'))
      })
    })

    describe('when token is retrieve-password type', () => {
      it('should throw exception if user does not exist', async () => {
        const verificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(verificationToken)

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseCreateAccountToken('test-user@test.es'))
      })

      it('should throw exception if verification token is expired', async () => {
        const verificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .withExpiresAt(fakeLocal.minus({ second: 30 }))
          .build()

        const user = testUserBuilder
          .withVerificationToken(Relationship.initializeRelation(verificationToken))
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseRecoverPasswordToken('test-user@test.es'))
      })

      it('should throw exception if verification token is not retrieve-password type', async () => {
        const verificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.CREATE_ACCOUNT)
          .withExpiresAt(fakeLocal.plus({ second: 30 }))
          .build()

        const user = testUserBuilder
          .withVerificationToken(Relationship.initializeRelation(verificationToken))
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseRecoverPasswordToken('test-user@test.es'))
      })

      it('should throw exception if verification token does not match', async () => {
        const verificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .withExpiresAt(fakeLocal.plus({ second: 30 }))
          .withToken('token')
          .build()

        const user = testUserBuilder
          .withVerificationToken(Relationship.initializeRelation(verificationToken))
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.tokenDoesNotMatch('test-user@test.es'))
      })
    })
  })
})
