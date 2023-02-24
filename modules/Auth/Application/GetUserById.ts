import { UserRepositoryInterface } from '../Domain/UserRepositoryInterface'
import { User } from '../Domain/User'
import { UserApplicationDto } from './UserApplicationDto'
import { UserApplicationDtoTranslator } from './UserApplicationDtoTranslator'
import { GetUserByIdApplicationException } from './GetUseByIdApplicationException'

export class GetUserById {
  constructor(
    private readonly userReposiory: UserRepositoryInterface
  ) {}

  public async get(userId: User['id']): Promise<UserApplicationDto> {
    const actor = await this.userReposiory.findById(userId)

    if (actor === null) {
      throw GetUserByIdApplicationException.userNotFound(userId)
    }

    return UserApplicationDtoTranslator.fromDomain(actor)
  }
}