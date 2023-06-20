import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { mock, mockReset } from 'jest-mock-extended'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { DateTime, Settings } from 'luxon'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerifyEmailAddress } from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddress'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Auth/Domain/TestVerificationTokenBuilder'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import {
  VerifyEmailAddressApplicationRequestInterface
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationRequestInterface'
import { User } from '~/modules/Auth/Domain/User'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
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
  let testVerificationTokenBuilder: TestVerificationTokenBuilder
  let testUserBuilder: TestUserBuilder
  let fakeLocal: DateTime
  let request: VerifyEmailAddressApplicationRequestInterface

  const buildUseCase = () => {
    return new VerifyEmailAddress(userRepository, verificationTokenRepository, cryptoService, userEmailSender)
  }

  beforeEach(() => {
    mockReset(cryptoService)
    mockReset(userRepository)
    mockReset(userEmailSender)
    mockReset(verificationTokenRepository)

    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    fakeLocal = DateTime.local(2022, 2, 25, 19, 28, 49, {
      zone: 'Europe/Madrid',
    })

    DateTime.local = jest.fn(() => fakeLocal)
    DateTime.now = jest.fn(() => fakeLocal)

    testVerificationTokenBuilder = new TestVerificationTokenBuilder()
      .withId('expected-id')
      .withCreatedAt(fakeLocal)
      .withExpiresAt(fakeLocal.plus({ minute: 30 }))
      .withToken('verify-email-token')
      .withType(VerificationTokenType.CREATE_ACCOUNT)
      .withUserEmail('test-user@test.es')

    testUserBuilder = new TestUserBuilder()
      .withId('test-user-id')
      .withEmail('test-user@test.es')
  })

  describe('when everything goes well', () => {
    describe('when verification token is create-account type', () => {
      let existingVerificationToken: VerificationToken
      let createdVerificationToken: VerificationToken

      beforeEach(() => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))

        existingVerificationToken = testVerificationTokenBuilder.build()
        createdVerificationToken = testVerificationTokenBuilder.build()

        jest.spyOn(User, 'buildVerificationTokenForAccountCreation').mockReturnValue(createdVerificationToken)

        request = {
          email: 'test-user@test.es',
          sendNewToken: true,
          type: VerificationTokenType.CREATE_ACCOUNT,
        }
      })

      it('should call repositories and services correctly when token exists and should be resent', async () => {
        verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(existingVerificationToken))

        jest.spyOn(User, 'buildVerificationTokenForAccountCreation').mockReturnValue(createdVerificationToken)

        const useCase = buildUseCase()

        await useCase.verify(request)

        expect(verificationTokenRepository.save).toBeCalledWith(createdVerificationToken, true)
        expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', createdVerificationToken)
      })

      it('should call repositories and services correctly when token does not exist', async () => {
        verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

        const useCase = buildUseCase()

        await useCase.verify(request)

        expect(verificationTokenRepository.save).toBeCalledWith(createdVerificationToken, true)
        expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', createdVerificationToken)
      })
    })

    describe('when verification token is retrieve-password type', () => {
      let existingVerificationToken: VerificationToken
      let createdVerificationToken: VerificationToken
      let user: User

      beforeEach(() => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))

        existingVerificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()

        createdVerificationToken = testVerificationTokenBuilder
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()

        request = {
          email: 'test-user@test.es',
          sendNewToken: true,
          type: VerificationTokenType.RETRIEVE_PASSWORD,
        }

        user = testUserBuilder
          .withVerificationToken(Relationship.initializeRelation(createdVerificationToken))
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        jest.spyOn(user, 'setVerificationToken').mockReturnValue(createdVerificationToken)
      })

      it('should call repositories and services correctly when token exists and should be resent', async () => {
        const useCase = buildUseCase()

        await useCase.verify(request)

        expect(verificationTokenRepository.save).toBeCalledWith(createdVerificationToken, true)
        expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', createdVerificationToken)
      })

      it('should call repositories and services correctly when user does not have a verification token', async () => {
        const foundUser = testUserBuilder
          .withVerificationToken(Relationship.initializeRelation(null))
          .build()

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        jest.spyOn(foundUser, 'setVerificationToken').mockReturnValue(createdVerificationToken)
        jest.spyOn(foundUser, 'assertVerificationTokenIsValidFor').mockImplementation(
          () => {
            throw UserDomainException.userHasNotAVerificationToken('test-user-id')
          }
        )
        jest.spyOn(foundUser, 'verificationToken', 'get').mockReturnValue(null)

        userRepository.findByEmail.mockResolvedValue(Promise.resolve(foundUser))
        const useCase = buildUseCase()

        await useCase.verify(request)

        expect(verificationTokenRepository.save).toBeCalledWith(createdVerificationToken, true)
        expect(userEmailSender.sendEmailVerificationEmail).toBeCalledWith('test-user@test.es', createdVerificationToken)
      })
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if verification token type is not a valid type', async () => {
      const useCase = buildUseCase()

      request = {
        ...request,
        type: 'invalid-type',
      }

      await expect(() => useCase.verify(request))
        .rejects
        .toStrictEqual(VerifyEmailAddressApplicationException.invalidTokenType('invalid-type'))
    })

    describe('when verification token is create-account type', () => {
      let existingToken: VerificationToken
      let createdToken: VerificationToken

      beforeEach(() => {
        request = {
          type: VerificationTokenType.CREATE_ACCOUNT,
          email: 'test-user@test.es',
          sendNewToken: false,
        }

        existingToken = testVerificationTokenBuilder
          .withToken(VerificationTokenType.CREATE_ACCOUNT)
          .build()

        createdToken = testVerificationTokenBuilder
          .withToken(VerificationTokenType.CREATE_ACCOUNT)
          .build()
      })

      it('should throw exception if user email is already registered', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(true))

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.emailAlreadyRegistered('test-user@test.es'))
      })

      it('should throw exception if valid token exists and sendNewToken flag is set to false', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(existingToken))

        jest.spyOn(existingToken, 'tokenHasExpired').mockReturnValue(false)

        request = {
          ...request,
          sendNewToken: false,
        }

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.existingTokenActive('test-user@test.es'))
      })

      it('should throw exception if token cannot be created due to invalid email', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

        jest.spyOn(User, 'buildVerificationTokenForAccountCreation').mockImplementation(() => {
          throw UserDomainException.cannotCreateVerificationToken('test-user@test.es')
        })

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.invalidEmailAddress('test-user@test.es'))
      })

      it('should throw exception if token cannot be created due to unexpected error', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
        verificationTokenRepository.save.mockImplementationOnce(() => {
          throw Error('unexpected database error')
        })

        jest.spyOn(User, 'buildVerificationTokenForAccountCreation').mockReturnValue(createdToken)

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.cannotCreateVerificationToken('test-user@test.es'))
      })

      it('should throw exception if token cannot be sent', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        verificationTokenRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
        userEmailSender.sendEmailVerificationEmail.mockImplementationOnce(() => {
          throw Error('unexpected error while trying to send email')
        })

        jest.spyOn(User, 'buildVerificationTokenForAccountCreation').mockReturnValue(createdToken)

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmail('test-user@test.es'))
      })
    })

    describe('when verification token is retrieve-password type', () => {
      let existingToken: VerificationToken
      let createdToken: VerificationToken
      const user = mock<User>({
        email: 'test-user@test.es',
      })

      beforeEach(() => {
        request = {
          type: VerificationTokenType.RETRIEVE_PASSWORD,
          email: 'test-user@test.es',
          sendNewToken: false,
        }

        existingToken = testVerificationTokenBuilder
          .withToken(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()

        createdToken = testVerificationTokenBuilder
          .withToken(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()
      })

      it('should throw exception if user does not exist', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.userNotFound('test-user@test.es'))
      })

      it('should throw exception if user has a valid token and sendNewToken flag is set to false', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        user.setVerificationToken.mockImplementation(() => {
          throw UserDomainException.userHasAlreadyAnActiveToken('expected-id')
        })

        request = {
          ...request,
          sendNewToken: false,
        }

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.existingTokenActive('test-user@test.es'))
      })

      it('should throw exception if an unexpected exception occurred while setting token to user', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        user.setVerificationToken.mockImplementationOnce(() => {
          throw UserDomainException.cannotAddVerificationTokenToAccountCreation('expected-id')
        })

        request = {
          ...request,
          sendNewToken: false,
        }

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(UserDomainException.cannotAddVerificationTokenToAccountCreation('expected-id'))
      })

      it('should throw exception if token cannot be created because of unexpected error', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        user.setVerificationToken.mockReturnValueOnce(createdToken)

        verificationTokenRepository.save.mockImplementationOnce(() => {
          throw Error('unexpected database error')
        })

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.cannotCreateVerificationToken('test-user@test.es'))
      })

      it('should throw exception if token cannot be sent because of unexpected error', async () => {
        userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

        user.setVerificationToken.mockReturnValueOnce(createdToken)

        userEmailSender.sendEmailVerificationEmail.mockImplementationOnce(() => {
          throw Error('unexpected error while trying to send email')
        })

        jest.spyOn(User, 'buildVerificationTokenForAccountCreation').mockReturnValue(createdToken)

        const useCase = buildUseCase()

        await expect(() => useCase.verify(request))
          .rejects
          .toStrictEqual(VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmail('test-user@test.es'))
      })
    })
  })
})
