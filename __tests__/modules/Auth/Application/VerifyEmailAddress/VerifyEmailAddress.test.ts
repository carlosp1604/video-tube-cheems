import { CryptoServiceInterface } from '~/modules/Auth/Domain/CryptoServiceInterface'
import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { mock, mockReset } from 'jest-mock-extended'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { DateTime, Settings } from 'luxon'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Auth/Domain/TestVerificationTokenBuilder'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerifyEmailAddress } from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddress'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationException'

jest.mock('crypto', () => {
  return {
    randomUUID: jest.fn(() => 'expected-id'),
  }
})

describe('modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddress.ts', () => {
  const cryptoService = mock<CryptoServiceInterface>()
  const verificationTokenRepository = mock<VerificationTokenRepositoryInterface>()
  const userEmailSender = mock<UserEmailSenderInterface>()
  const userRepository = mock<UserRepositoryInterface>()
  let verificationToken: VerificationToken
  let existingToken: VerificationToken
  let fakeLocal: DateTime

  const buildUseCase = () => {
    return new VerifyEmailAddress(userRepository, verificationTokenRepository, cryptoService, userEmailSender)
  }

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    fakeLocal = DateTime.local(2022, 2, 25, 19, 28, 49, {
      zone: 'Europe/Madrid',
    })

    DateTime.local = jest.fn(() => fakeLocal)
    DateTime.now = jest.fn(() => fakeLocal)

    mockReset(cryptoService)
    mockReset(userRepository)
    mockReset(userEmailSender)
    mockReset(verificationTokenRepository)

    verificationToken = new TestVerificationTokenBuilder()
      .withId('expected-id')
      .withCreatedAt(fakeLocal)
      .withExpiresAt(fakeLocal.plus({ minute: 60 }))
      .withToken('verify-email-token')
      .withType(VerificationTokenType.VERIFY_EMAIL)
      .withUserEmail('test-user@test.es')
      .build()

    existingToken = new TestVerificationTokenBuilder()
      .withId('expected-existing-id')
      .withCreatedAt(fakeLocal)
      .withExpiresAt(fakeLocal.plus({ minute: 60 }))
      .withToken('verify-email-token')
      .withType(VerificationTokenType.VERIFY_EMAIL)
      .withUserEmail('test-user@test.es')
      .build()
  })

  describe('when everything goes well', () => {
    beforeEach(() => {
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
      cryptoService.hash.mockReturnValue(Promise.resolve('hashed-password'))
      cryptoService.randomHash.mockResolvedValue(Promise.resolve('verify-email-token'))
    })

    // This case only makes sense if already exists a verification token for user
    describe('sendNewToken flag', () => {
      it('should call to repositories and services correctly when flag is active',
        async () => {
          verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(existingToken))

          const useCase = buildUseCase()

          await useCase.verify({ email: 'test-user@test.es', sendNewToken: true })

          expect(userRepository.existsByEmail).toBeCalledWith('test-user@test.es')
          expect(verificationTokenRepository.findByEmail).toBeCalledWith('test-user@test.es')
          expect(cryptoService.randomHash).toBeCalledTimes(1)
          expect(verificationTokenRepository.delete).toBeCalledWith(existingToken)
          expect(verificationTokenRepository.save).toBeCalledWith(verificationToken)
          expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', verificationToken)
        })

      it('should call to repositories and services correctly when flag is not active and token is expired',
        async () => {
          existingToken = new TestVerificationTokenBuilder()
            .withId('expected-existing-id')
            .withCreatedAt(fakeLocal)
            .withExpiresAt(fakeLocal.minus({ second: 1 }))
            .withToken('verify-email-token')
            .withType(VerificationTokenType.RECOVER_PASSWORD)
            .withUserEmail('test-user@test.es')
            .build()
          verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(existingToken))

          const useCase = buildUseCase()

          await useCase.verify({ email: 'test-user@test.es', sendNewToken: false })

          expect(userRepository.existsByEmail).toBeCalledWith('test-user@test.es')
          expect(verificationTokenRepository.findByEmail).toBeCalledWith('test-user@test.es')
          expect(cryptoService.randomHash).toBeCalledTimes(1)
          expect(verificationTokenRepository.delete).toBeCalledWith(existingToken)
          expect(verificationTokenRepository.save).toBeCalledWith(verificationToken)
          expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', verificationToken)
        })
    })

    it('should call to repositories and services correctly when user does not have any token', async () => {
      verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

      const useCase = buildUseCase()

      await useCase.verify({ email: 'test-user@test.es', sendNewToken: false })

      expect(userRepository.existsByEmail).toBeCalledWith('test-user@test.es')
      expect(verificationTokenRepository.findByEmail).toBeCalledWith('test-user@test.es')
      expect(cryptoService.randomHash).toBeCalledTimes(1)
      expect(verificationTokenRepository.delete).not.toBeCalled()
      expect(verificationTokenRepository.save).toBeCalledWith(verificationToken)
      expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', verificationToken)
    })
  })

  describe('when there are failures', () => {
    it('should throw emailAlreadyRegistered exception if an user with input email is found', async () => {
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(true))

      const useCase = buildUseCase()

      await expect(useCase.verify({ email: 'test-user@test.es', sendNewToken: false }))
        .rejects
        .toStrictEqual(VerifyEmailAddressApplicationException.emailAlreadyRegistered('test-user@test.es'))
    })

    it('should throw existingTokenActive exception if a token is found and its active', async () => {
      existingToken = new TestVerificationTokenBuilder()
        .withId('expected-existing-id')
        .withCreatedAt(fakeLocal)
        .withExpiresAt(fakeLocal.plus({ minutes: 1 }))
        .withToken('verify-email-token')
        .withType(VerificationTokenType.VERIFY_EMAIL)
        .withUserEmail('test-user@test.es')
        .build()
      verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(existingToken))
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))

      const useCase = buildUseCase()

      await expect(useCase.verify({ email: 'test-user@test.es', sendNewToken: false }))
        .rejects
        .toStrictEqual(VerifyEmailAddressApplicationException.existingTokenActive('test-user@test.es'))
    })

    it('should throw cannotSendVerificationTokenEmail exception if email could not be sent', async () => {
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
      verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
      verificationTokenRepository.save.mockImplementation(() => { throw Error() })

      const useCase = buildUseCase()

      await expect(useCase.verify({ email: 'test-user@test.es', sendNewToken: false }))
        .rejects
        .toStrictEqual(VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmail('test-user@test.es'))
    })

    it('should throw cannotCreateVerificationToken exception if email could not be created', async () => {
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
      verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
      verificationTokenRepository.save.mockImplementation(() => { throw Error() })

      const useCase = buildUseCase()

      await expect(useCase.verify({ email: 'test-user@test.e', sendNewToken: false }))
        .rejects
        .toStrictEqual(VerifyEmailAddressApplicationException.cannotCreateVerificationToken('test-user@test.e'))
    })
  })
})
