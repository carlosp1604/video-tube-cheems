import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { GetUserById } from '~/modules/Auth/Application/GetUser/GetUserById'
import { mock, mockReset } from 'jest-mock-extended'
import { TestUserBuilder } from '~/__tests__/modules/Domain/TestUserBuilder'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { GetUserByIdApplicationException } from '~/modules/Auth/Application/GetUser/GetUserByIdApplicationException'

describe('~/modules/Auth/Application/GetUser/GetUserById.ts', () => {
  let user: User
  const nowDate = DateTime.now()
  const userRepository = mock<UserRepositoryInterface>()

  const buildUseCase = () => {
    return new GetUserById(userRepository)
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

      userRepository.findById.mockResolvedValue(Promise.resolve(user))
    })

    it('should call to repositories correctly', async () => {
      const useCase = buildUseCase()

      await useCase.get('expected-user-id')

      expect(userRepository.findById).toBeCalledWith('expected-user-id')
    })

    it('should return user correctly', async () => {
      const useCase = buildUseCase()

      const returnedUser = await useCase.get('expected-user-id')

      expect(user.id).toStrictEqual(returnedUser.id)
      expect(user.email).toStrictEqual(returnedUser.email)
    })
  })

  describe('when there are failures', () => {
    beforeEach(() => {
      mockReset(userRepository)
    })

    it('should throw exception if user does not exists', async () => {
      userRepository.findById.mockResolvedValue(Promise.resolve(null))
      const useCase = buildUseCase()

      await expect(useCase.get('expected-user-id'))
        .rejects
        .toStrictEqual(GetUserByIdApplicationException.userNotFound('expected-user-id'))
    })
  })
})
