import { User } from '~/modules/Auth/Domain/User'
import { VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import {
  ChangeUserPasswordApplicationRequest
} from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPasswordApplicationRequest'
import {
  ChangeUserPasswordApplicationException
} from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPasswordApplicationException'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'

export class ChangeUserPassword {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly userRepository: UserRepositoryInterface) {}

  public async change (request: ChangeUserPasswordApplicationRequest): Promise<void> {
    const user = await this.getUser(request.email)

    this.assertTokenIsValid(user, request.token)

    await this.changeUserPassword(user, request)

    user.removeVerificationToken()

    try {
      await this.userRepository.update(user, true)
    } catch (exception: unknown) {
      console.error(exception)

      throw ChangeUserPasswordApplicationException.cannotUpdateUser(request.email)
    }
  }

  private async getUser (
    userEmail: ChangeUserPasswordApplicationRequest['email']
  ): Promise<User> {
    const user = await this.userRepository.findByEmail(userEmail, ['verificationToken'])

    if (user === null) {
      throw ChangeUserPasswordApplicationException.userNotFound(userEmail)
    }

    return user
  }

  private assertTokenIsValid (user: User, token: ChangeUserPasswordApplicationRequest['token']): void {
    try {
      user.assertVerificationTokenIsValidFor(VerificationTokenType.RETRIEVE_PASSWORD, token)
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case UserDomainException.userHasNotAVerificationTokenId:
          throw ChangeUserPasswordApplicationException.verificationTokenNotFound(user.email)
        case UserDomainException.verificationTokenIsNotValidForId:
          throw ChangeUserPasswordApplicationException.verificationTokenIsNotValid(user.email)
        case UserDomainException.tokenDoesNotMatchId:
          throw ChangeUserPasswordApplicationException.tokenDoesNotMatch(user.email)
        default:
          throw exception
      }
    }
  }

  private async changeUserPassword (user: User, request: ChangeUserPasswordApplicationRequest): Promise<void> {
    try {
      await user.changeUserPassword(request.password)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidPasswordId) {
        throw ChangeUserPasswordApplicationException.invalidPassword(request.password)
      }

      throw exception
    }
  }
}
