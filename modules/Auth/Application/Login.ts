import { LoginApplicationRequestInterface } from '~/modules/Auth/Application/LoginApplicationRequestInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { LoginApplicationException } from '~/modules/Auth/Application/LoginApplicationException'

export class Login {
  // eslint-disable-next-line no-useless-constructor
  constructor (private userRepository: UserRepositoryInterface) {}

  public async login (request: LoginApplicationRequestInterface): Promise<User> {
    const user = await this.getUser(request.email)
    const isUserAccountActive = user.isAccountActive()

    if (!isUserAccountActive) {
      throw LoginApplicationException.userAccountNotActive(request.email)
    }

    const passwordsMatches = await user.matchPasswords(request.password)

    if (!passwordsMatches) {
      throw LoginApplicationException.userPasswordDoesNotMatch(request.email)
    }

    return user
  }

  private async getUser (userEmail: LoginApplicationRequestInterface['email']): Promise<User> {
    const user = await this.userRepository.findByEmail(userEmail)

    if (user === null) {
      throw LoginApplicationException.userNotFound(userEmail)
    }

    return user
  }
}
