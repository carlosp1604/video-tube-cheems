import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { mock, mockReset } from 'jest-mock-extended'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
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

jest.mock('crypto', () => {
  return {
    randomUUID: jest.fn(() => 'expected-id'),
  }
})

describe('~/modules/Auth/Application/ValidateCode/ValidateCode.ts', () => {
  let validateTokenRequest: ValidateTokenApplicationRequestInterface
  const userRepository = mock<UserRepositoryInterface>()
  const verificationTokenRepository = mock<VerificationTokenRepositoryInterface>()
  let verificationToken: VerificationToken
  let fakeLocal: DateTime

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
      token: 'verify-email-token',
    }

    verificationToken = new TestVerificationTokenBuilder()
      .withExpiresAt(fakeLocal.plus({ minute: 30 }))
      .withType(VerificationTokenType.VERIFY_EMAIL)
      .withUserEmail('test-user@test.es')
      .build()
  })

  describe('when everything goes well', () => {
    it('should call to repositories and services correctly when verification is verify-email type', async () => {
      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))

      const useCase = buildUseCase()

      await useCase.validate(validateTokenRequest)

      expect(verificationTokenRepository.findByEmailAndToken).toBeCalledWith('test-user@test.es', 'verify-email-token')
      expect(userRepository.existsByEmail).toBeCalledWith('test-user@test.es')
    })

    it('should call to repositories and services correctly when verification is recover-password type', async () => {
      verificationToken = new TestVerificationTokenBuilder()
        .withType(VerificationTokenType.RECOVER_PASSWORD)
        .withUserEmail('test-user@test.es')
        .withExpiresAt(fakeLocal.plus({ minute: 30 }))
        .build()

      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(true))

      const useCase = buildUseCase()

      await useCase.validate(validateTokenRequest)

      expect(verificationTokenRepository.findByEmailAndToken).toBeCalledWith('test-user@test.es', 'verify-email-token')
      expect(userRepository.existsByEmail).toBeCalledWith('test-user@test.es')
    })

    it('should return the correct response', async () => {
      verificationToken = new TestVerificationTokenBuilder()
        .withId('expected-id')
        .withType(VerificationTokenType.RECOVER_PASSWORD)
        .withUserEmail('test-user@test.es')
        .withToken('expected-token')
        .withExpiresAt(fakeLocal.plus({ minute: 30 }))
        .build()

      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(true))

      const useCase = buildUseCase()

      const response = await useCase.validate(validateTokenRequest)

      expect(response).toStrictEqual(response)
    })
  })

  describe('when there are failures', () => {
    it('should throw verificationTokenNotFound exception if token does not exist', async () => {
      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(null))

      const useCase = buildUseCase()

      await expect(useCase.validate(validateTokenRequest))
        .rejects
        .toStrictEqual(ValidateTokenApplicationException.verificationTokenNotFound('test-user@test.es'))
    })

    it('should throw verificationTokenExpired exception if token has expired', async () => {
      verificationToken = new TestVerificationTokenBuilder()
        .withType(VerificationTokenType.RECOVER_PASSWORD)
        .withUserEmail('test-user@test.es')
        .withExpiresAt(fakeLocal.minus({ second: 1 }))
        .build()

      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))

      const useCase = buildUseCase()

      await expect(useCase.validate(validateTokenRequest))
        .rejects
        .toStrictEqual(ValidateTokenApplicationException.verificationTokenExpired('test-user@test.es'))
    })

    it('should throw cannotUseVerifyEmailToken exception if token is verify-email type and user exists', async () => {
      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(true))

      const useCase = buildUseCase()

      await expect(useCase.validate(validateTokenRequest))
        .rejects
        .toStrictEqual(ValidateTokenApplicationException.cannotUseVerifyEmailToken('test-user@test.es'))
    })

    it('should throw cannotUseRecoverPasswordToken exception if token is recover-password type and user does not exist',
      async () => {
        verificationToken = new TestVerificationTokenBuilder()
          .withType(VerificationTokenType.RECOVER_PASSWORD)
          .withUserEmail('test-user@test.es')
          .withExpiresAt(fakeLocal.plus({ second: 30 }))
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))

        const useCase = buildUseCase()

        await expect(useCase.validate(validateTokenRequest))
          .rejects
          .toStrictEqual(ValidateTokenApplicationException.cannotUseRecoverPasswordToken('test-user@test.es'))
      })
  })
})
