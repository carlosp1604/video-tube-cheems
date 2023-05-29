import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { CreateUserApplicationRequestInterface } from '~/modules/Auth/Application/CreateUserApplicationRequestInterface'
import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUserApplicationException'
import * as crypto from 'crypto'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'

export class CreateUser {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface
  ) {}

  public async create (request: CreateUserApplicationRequestInterface): Promise<void> {
    const token = await this.getVerificationToken(request.email, request.token)

    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(request.email),
      this.userRepository.existsByUsername(request.username),
    ])

    if (emailExists) {
      throw CreateUserApplicationException.emailAlreadyRegistered(request.email)
    }

    if (usernameExists) {
      throw CreateUserApplicationException.usernameAlreadyRegistered(request.username)
    }

    try {
      const user = await this.buildUser(request)

      await this.userRepository.save(user)
    } catch (exception: unknown) {
      console.error(exception)

      throw CreateUserApplicationException.cannotCreateUser(request.email)
    }

    // TODO: Handle possible errors?
    await this.verificationTokenRepository.delete(token)
  }

  private async getVerificationToken (
    userEmail: VerificationToken['userEmail'],
    token: VerificationToken['token']
  ): Promise<VerificationToken> {
    const verificationToken = await this.verificationTokenRepository
      .findByEmailAndToken(userEmail, token)

    if (
      verificationToken === null ||
      verificationToken.tokenHasExpired() ||
      verificationToken.type !== 'verify-email'
    ) {
      throw CreateUserApplicationException.verificationTokenIsNotValid(userEmail)
    }

    return verificationToken
  }

  private async buildUser (request: CreateUserApplicationRequestInterface): Promise<User> {
    const userId = crypto.randomUUID()

    const hashedPassword = await this.cryptoService.hash(request.password)

    const nowDate = DateTime.now()

    return new User(
      userId,
      request.name,
      request.username,
      request.email,
      null, // when a user is created it has not a imageUrl
      request.language,
      hashedPassword,
      nowDate,
      nowDate,
      nowDate,
      null
    )
  }
}
