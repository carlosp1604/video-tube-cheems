import { User } from '~/modules/Auth/Domain/User'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'
import { GetUserByIdApplicationException } from './GetUserByIdApplicationException'

export class GetUserById {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly userRepository: UserRepositoryInterface) {}

  public async get (userId: User['id']): Promise<UserApplicationDto> {
    const actor = await this.userRepository.findById(userId)

    if (actor === null) {
      throw GetUserByIdApplicationException.userNotFound(userId)
    }

    return UserApplicationDtoTranslator.fromDomain(actor)
  }
}
