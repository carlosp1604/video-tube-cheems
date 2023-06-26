import { CreateUserApplicationRequestInterface } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationRequestInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { mock, mockReset } from 'jest-mock-extended'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { User } from '~/modules/Auth/Domain/User'
import { DateTime, Settings } from 'luxon'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationException'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { CreateUser } from '~/modules/Auth/Application/CreateUser/CreateUser'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { TestUserBuilder } from '~/__tests__/modules/Auth/Domain/TestUserBuilder'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Auth/Domain/TestVerificationTokenBuilder'

jest.mock('crypto', () => {
  return {
    randomUUID: jest.fn(() => 'expected-id'),
  }
})

describe('~/modules/Auth/Application/CreateUser/CreateUser.ts', () => {
  let createUserRequest: CreateUserApplicationRequestInterface
  const cryptoService = mock<CryptoServiceInterface>()
  const verificationTokenRepository = mock<VerificationTokenRepositoryInterface>()
  const userRepository = mock<UserRepositoryInterface>()
  let user: User
  let verificationToken: VerificationToken
  let fakeLocal: DateTime

  const buildUseCase = () => {
    return new CreateUser(userRepository, verificationTokenRepository, cryptoService)
  }

  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'

    fakeLocal = DateTime.local(2023, 2, 25, 19, 28, 49, {
      zone: 'Europe/Madrid',
    })

    DateTime.local = jest.fn(() => fakeLocal)
    DateTime.now = jest.fn(() => fakeLocal)

    mockReset(cryptoService)
    mockReset(userRepository)
    mockReset(verificationTokenRepository)

    createUserRequest = {
      email: 'test-user@test.es',
      password: 'test-user-password',
      username: 'test_username',
      language: 'es',
      name: 'Test User Name',
      token: 'test-verification-token',
    }

    user = new TestUserBuilder()
      .withId('expected-id')
      .withCreatedAt(fakeLocal)
      .withUpdatedAt(fakeLocal)
      .withEmail('test-user@test.es')
      .withLanguage('es')
      .withName('Test User Name')
      .withUsername('test_username')
      .withPassword('hashed-password')
      .withEmailVerified(fakeLocal)
      .build()

    verificationToken = new TestVerificationTokenBuilder()
      .withId('expected-id')
      .withCreatedAt(fakeLocal)
      .withExpiresAt(fakeLocal.plus({ minute: 30 }))
      .withToken('test-verification-token')
      .withType(VerificationTokenType.CREATE_ACCOUNT)
      .withUserEmail('test-user@test.es')
      .build()
  })

  describe('when everything goes well', () => {
    beforeEach(() => {
      verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
      userRepository.existsByUsername.mockResolvedValue(Promise.resolve(false))
      cryptoService.hash.mockReturnValue(Promise.resolve('hashed-password'))
    })

    it('should call to repositories and services correctly', async () => {
      const useCase = buildUseCase()

      await useCase.create(createUserRequest)

      expect(verificationTokenRepository.findByEmailAndToken)
        .toBeCalledWith('test-user@test.es', 'test-verification-token')
      expect(userRepository.existsByUsername).toBeCalledWith('test_username')
      expect(userRepository.existsByEmail).toBeCalledWith('test-user@test.es')
      expect(cryptoService.hash).toBeCalledWith('test-user-password')
      expect(userRepository.save).toBeCalledWith(user)
    })
  })

  describe('when there are failures', () => {
    describe('verification token validation', () => {
      it('should throw exception if verification token does not exist', async () => {
        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(null))

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.verificationTokenIsNotValid('test-user@test.es'))
      })

      it('should throw exception if verification token has expired', async () => {
        verificationToken = new TestVerificationTokenBuilder()
          .withExpiresAt(fakeLocal.minus({ second: 30 }))
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.verificationTokenIsNotValid('test-user@test.es'))
      })

      it('should throw exception if verification token is not create-account type', async () => {
        verificationToken = new TestVerificationTokenBuilder()
          .withExpiresAt(fakeLocal.plus({ second: 30 }))
          .withType(VerificationTokenType.RETRIEVE_PASSWORD)
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.verificationTokenIsNotValid('test-user@test.es'))
      })
    })

    describe('duplicated validation', () => {
      beforeEach(() => {
        verificationToken = new TestVerificationTokenBuilder()
          .withExpiresAt(fakeLocal.plus({ second: 30 }))
          .withType(VerificationTokenType.CREATE_ACCOUNT)
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
      })

      it('should throw exception if email is already registered', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(true))
        userRepository.existsByUsername.mockResolvedValue(Promise.resolve(false))

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.emailAlreadyRegistered('test-user@test.es'))
      })

      it('should throw exception if username is already registered', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        userRepository.existsByUsername.mockResolvedValue(Promise.resolve(true))

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.usernameAlreadyRegistered('test_username'))
      })

      it('should throw exception if user cannot be created', async () => {
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        userRepository.existsByUsername.mockResolvedValue(Promise.resolve(false))
        userRepository.save.mockImplementation(() => { throw new Error() })

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.cannotCreateUser('test-user@test.es'))
      })
    })

    describe('user data validation', () => {
      beforeEach(() => {
        verificationToken = new TestVerificationTokenBuilder()
          .withExpiresAt(fakeLocal.plus({ second: 30 }))
          .withType(VerificationTokenType.CREATE_ACCOUNT)
          .build()

        verificationTokenRepository.findByEmailAndToken.mockResolvedValue(Promise.resolve(verificationToken))
        userRepository.existsByEmail.mockResolvedValue(Promise.resolve(false))
        userRepository.existsByUsername.mockResolvedValue(Promise.resolve(false))
      })

      it('should throw exception if user email is invalid', async () => {
        createUserRequest = {
          ...createUserRequest,
          email: 'invalidemail',
        }

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.invalidEmail('invalidemail'))
      })

      it('should throw exception if user username is invalid', async () => {
        createUserRequest = {
          ...createUserRequest,
          username: 'invalidusername,.',
        }

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.invalidUsername('invalidusername,.'))
      })

      it('should throw exception if user name is invalid', async () => {
        createUserRequest = {
          ...createUserRequest,
          name: 'invalid_name',
        }

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.invalidName('invalid_name'))
      })

      it('should throw exception if user password is invalid', async () => {
        createUserRequest = {
          ...createUserRequest,
          password: 'invalid',
        }

        const useCase = buildUseCase()

        await expect(useCase.create(createUserRequest))
          .rejects
          .toStrictEqual(CreateUserApplicationException.invalidPassword('invalid'))
      })
    })
  })
})
