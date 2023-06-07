import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { mock, mockReset } from 'jest-mock-extended'
import { VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import {
  ChangeUserPasswordApplicationRequest
} from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPasswordApplicationRequest'
import { User } from '~/modules/Auth/Domain/User'
import { ChangeUserPassword } from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPassword'
import {
  ChangeUserPasswordApplicationException
} from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPasswordApplicationException'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'

describe('~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPassword.ts', () => {
  let changeUserPasswordRequest: ChangeUserPasswordApplicationRequest
  const userRepository = mock<UserRepositoryInterface>()
  const user = mock<User>({
    id: 'test-user-id',
    email: 'test-user@test.es',
  })

  const buildUseCase = () => {
    return new ChangeUserPassword(userRepository)
  }

  beforeEach(() => {
    mockReset(userRepository)

    changeUserPasswordRequest = {
      email: 'test-user@test.es',
      password: 'test-user-password',
      token: 'test-verification-token',
    }
  })

  describe('when everything goes well', () => {
    beforeEach(() => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))
    })

    it('should call to repositories and services correctly', async () => {
      user.assertVerificationTokenIsValidFor.mockImplementation()
      user.changeUserPassword.mockImplementation()
      user.removeVerificationToken.mockImplementation()

      const useCase = buildUseCase()

      await useCase.change(changeUserPasswordRequest)

      expect(userRepository.findByEmail).toBeCalledWith('test-user@test.es', ['verificationToken'])
      expect(userRepository.update).toBeCalledWith(user, true)
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if user does not exists', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(ChangeUserPasswordApplicationException.userNotFound('test-user@test.es'))
    })

    it('should throw exception if user does not have a verification token', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation(() => {
        throw UserDomainException.userHasNotAVerificationToken('test-user-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(ChangeUserPasswordApplicationException.verificationTokenNotFound('test-user@test.es'))
    })

    it('should throw exception if verification token has expired', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation(() => {
        throw UserDomainException.verificationTokenIsNotValidFor(
          'test-user-id', VerificationTokenType.RETRIEVE_PASSWORD
        )
      })
    })

    it('should throw exception if verification token is not correct type', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation(() => {
        throw UserDomainException.verificationTokenIsNotValidFor(
          'test-user-id', VerificationTokenType.RETRIEVE_PASSWORD
        )
      })

      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(ChangeUserPasswordApplicationException.verificationTokenIsNotValid('test-user@test.es'))
    })

    it('should throw exception if token does not match', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation(() => {
        throw UserDomainException.tokenDoesNotMatch('test-verification-token')
      })

      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(ChangeUserPasswordApplicationException.tokenDoesNotMatch('test-user@test.es'))
    })

    it('should throw exception if token cannot be removed', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation()

      user.removeVerificationToken.mockImplementation(() => {
        throw UserDomainException.cannotRemoveVerificationToken('test-user-id')
      })

      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(UserDomainException.cannotRemoveVerificationToken('test-user-id'))
    })

    it('should throw exception if token user cannot be updated', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation()
      user.removeVerificationToken.mockImplementation()

      userRepository.update.mockImplementation(() => {
        throw Error('Something went wrong')
      })

      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(ChangeUserPasswordApplicationException.cannotUpdateUser('test-user@test.es'))
    })

    it('should throw exception if a unexpected error occurred', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(user))

      user.assertVerificationTokenIsValidFor.mockImplementation()

      user.changeUserPassword.mockImplementation(() => {
        throw Error('Something went wrong')
      })

      const useCase = buildUseCase()

      await expect(useCase.change(changeUserPasswordRequest))
        .rejects
        .toStrictEqual(Error('Something went wrong'))
    })
  })
})
