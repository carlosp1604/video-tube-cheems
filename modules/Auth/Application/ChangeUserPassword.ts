import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { ChangeUserPasswordApplicationRequest } from '~/modules/Auth/Application/ChangeUserPasswordApplicationRequest'
import {
  ChangeUserPasswordApplicationException
} from '~/modules/Auth/Application/ChangeUserPasswordApplicationException'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'

export class ChangeUserPassword {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface
  ) {}

  public async change (request: ChangeUserPasswordApplicationRequest): Promise<void> {
    const user = await this.getUser(request.email)

    const token = await this.getVerificationToken(request.email, request.token)

    user.password = await this.cryptoService.hash(request.password)
    user.updatedAt = DateTime.now()

    try {
      await this.userRepository.update(user)
      console.log(user)
    } catch (exception: unknown) {
      console.error(exception)

      throw ChangeUserPasswordApplicationException.cannotUpdateUser(request.email)
    }

    // TODO: Handle possible errors?
    await this.verificationTokenRepository.delete(token)
  }

  private async getUser (
    userEmail: ChangeUserPasswordApplicationRequest['email']
  ): Promise<User> {
    const user = await this.userRepository.findByEmail(userEmail)

    if (user === null) {
      throw ChangeUserPasswordApplicationException.userNotFound(userEmail)
    }

    return user
  }

  private async getVerificationToken (
    userEmail: ChangeUserPasswordApplicationRequest['email'],
    token: ChangeUserPasswordApplicationRequest['token']
  ): Promise<VerificationToken> {
    const verificationToken = await this.verificationTokenRepository.findByEmailAndToken(userEmail, token)

    if (
      verificationToken === null ||
      verificationToken.tokenHasExpired() ||
      verificationToken.type !== 'recover-password'
    ) {
      throw ChangeUserPasswordApplicationException.verificationTokenIsNotValid(userEmail)
    }

    return verificationToken
  }
}
