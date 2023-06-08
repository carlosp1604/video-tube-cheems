import { UserApplicationDto } from '../Dtos/UserApplicationDto'
import { UserApplicationDtoTranslator } from '../Translators/UserApplicationDtoTranslator'
import { GetUserByIdApplicationException } from './GetUserByIdApplicationException'
import { User } from '~/modules/Auth/Domain/User'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'

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
