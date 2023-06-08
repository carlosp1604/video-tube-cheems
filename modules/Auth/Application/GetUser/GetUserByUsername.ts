import { User } from '~/modules/Auth/Domain/User'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'
import {
  GetUserByUsernameApplicationException
} from '~/modules/Auth/Application/GetUser/GetUserByUsernameApplicationException'

export class GetUserByUsername {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly userRepository: UserRepositoryInterface) {}

  public async get (username: User['username']): Promise<UserApplicationDto> {
    const user = await this.userRepository.findByUsername(username)

    if (user === null) {
      throw GetUserByUsernameApplicationException.userNotFound(username)
    }

    return UserApplicationDtoTranslator.fromDomain(user)
  }
}
