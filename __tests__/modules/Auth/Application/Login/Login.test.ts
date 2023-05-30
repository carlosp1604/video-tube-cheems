import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { mock, mockReset } from 'jest-mock-extended'
import { Login } from '~/modules/Auth/Application/Login/Login'
import { LoginApplicationException } from '~/modules/Auth/Application/Login/LoginApplicationException'
import { DateTime } from 'luxon'

describe('~/modules/Auth/Application/Login/Login.ts', () => {
  const user = mock<User>({
    emailVerified: null,
    updatedAt: DateTime.now(),
    createdAt: DateTime.now(),
  })
  const userRepository = mock<UserRepositoryInterface>()

  const buildUseCase = () => {
    return new Login(userRepository)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      mockReset(user)
      mockReset(userRepository)

      userRepository.findByEmail.mockResolvedValue(user)
      user.matchPasswords.mockResolvedValue(Promise.resolve(true))
      user.isAccountActive.mockReturnValue(true)
    })

    it('should call to repositories correctly', async () => {
      const useCase = buildUseCase()

      await useCase.login({ email: 'user-email@test.es', password: 'password' })

      expect(userRepository.findByEmail).toBeCalledWith('user-email@test.es')
    })

    it('should return user correctly', async () => {
      const useCase = buildUseCase()

      const returnedUser = await useCase.login({ email: 'user-email@test.es', password: 'password' })

      expect(user.id).toStrictEqual(returnedUser.id)
    })
  })

  describe('when there are failures', () => {
    beforeEach(() => {
      mockReset(user)
      mockReset(userRepository)
    })

    it('should throw userNotFound exception if user does not exists', async () => {
      userRepository.findByEmail.mockResolvedValue(Promise.resolve(null))
      const useCase = buildUseCase()

      await expect(useCase.login({ email: 'user-email@test.es', password: 'password' }))
        .rejects
        .toStrictEqual(LoginApplicationException.userNotFound('user-email@test.es'))
    })

    it('should throw userAccountNotActive exception if user did not verified their email', async () => {
      userRepository.findByEmail.mockResolvedValue(user)
      user.isAccountActive.mockReturnValue(false)
      const useCase = buildUseCase()

      await expect(useCase.login({ email: 'user-email@test.es', password: 'password' }))
        .rejects
        .toStrictEqual(LoginApplicationException.userAccountNotActive('user-email@test.es'))
    })

    it('should throw userPasswordDoesNotMatch exception if provided password does not match', async () => {
      userRepository.findByEmail.mockResolvedValue(user)
      user.isAccountActive.mockReturnValue(true)
      user.matchPasswords.mockResolvedValue(Promise.resolve(false))
      const useCase = buildUseCase()

      await expect(useCase.login({ email: 'user-email@test.es', password: 'password' }))
        .rejects
        .toStrictEqual(LoginApplicationException.userPasswordDoesNotMatch('user-email@test.es'))
    })
  })
})
