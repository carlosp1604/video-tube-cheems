import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { mock, mockReset } from 'jest-mock-extended'
import { TestUserBuilder } from '~/__tests__/modules/Domain/TestUserBuilder'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import {
  GetUserByUsernameApplicationException
} from '~/modules/Auth/Application/GetUser/GetUserByUsernameApplicationException'

describe('~/modules/Auth/Application/GetUser/GetUserByUsername.ts', () => {
  let user: User
  const nowDate = DateTime.now()
  const userRepository = mock<UserRepositoryInterface>()

  const buildUseCase = () => {
    return new GetUserByUsername(userRepository)
  }

  describe('when everything goes well', () => {
    beforeEach(() => {
      mockReset(userRepository)

      user = new TestUserBuilder()
        .withId('expected-user-id')
        .withEmail('expected-emaild@email.es')
        .withCreatedAt(nowDate)
        .withEmailVerified(nowDate)
        .withImageUrl(null)
        .withName('expected name')
        .withUsername('expected_username')
        .withUpdatedAt(nowDate)
        .withLanguage('expected-language')
        .build()

      userRepository.findByUsername.mockResolvedValue(Promise.resolve(user))
    })

    it('should call to repositories correctly', async () => {
      const useCase = buildUseCase()

      await useCase.get('expected_username')

      expect(userRepository.findByUsername).toBeCalledWith('expected_username')
    })

    it('should return user correctly', async () => {
      const useCase = buildUseCase()

      const returnedUser = await useCase.get('expected_username')

      expect(user.id).toStrictEqual(returnedUser.id)
      expect(user.username).toStrictEqual(returnedUser.username)
      expect(user.email).toStrictEqual(returnedUser.email)
    })
  })

  describe('when there are failures', () => {
    beforeEach(() => {
      mockReset(userRepository)
    })

    it('should throw exception if user does not exists', async () => {
      userRepository.findByUsername.mockResolvedValue(Promise.resolve(null))
      const useCase = buildUseCase()

      await expect(useCase.get('expected_username'))
        .rejects
        .toStrictEqual(GetUserByUsernameApplicationException.userNotFound('expected_username'))
    })
  })
})
