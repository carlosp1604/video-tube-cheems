import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { CreateUserApplicationRequestInterface } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationRequestInterface'
import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationException'
import * as crypto from 'crypto'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class CreateUser {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface
  ) {}

  public async create (request: CreateUserApplicationRequestInterface): Promise<void> {
    const token = await this.getVerificationToken(request.email, request.token)

    await this.checkIfEmailOrUsernameAreBeignUsed(request.email, request.username)

    const user = await this.buildUser(request)

    try {
      await this.userRepository.save(user)
    } catch (exception: unknown) {
      console.error(exception)

      throw CreateUserApplicationException.cannotCreateUser(request.email)
    }

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

  private async checkIfEmailOrUsernameAreBeignUsed (
    email: CreateUserApplicationRequestInterface['email'],
    username: CreateUserApplicationRequestInterface['username']
  ): Promise<void> {
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(email),
      this.userRepository.existsByUsername(username),
    ])

    if (emailExists) {
      throw CreateUserApplicationException.emailAlreadyRegistered(email)
    }

    if (usernameExists) {
      throw CreateUserApplicationException.usernameAlreadyRegistered(username)
    }
  }

  private async buildUser (request: CreateUserApplicationRequestInterface): Promise<User> {
    const userId = crypto.randomUUID()

    const hashedPassword = await this.cryptoService.hash(request.password)

    const nowDate = DateTime.now()

    try {
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
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      switch (exception.id) {
        case ValidationException.invalidEmailId:
          throw CreateUserApplicationException.invalidEmail(request.email)

        case ValidationException.invalidUsernameId:
          throw CreateUserApplicationException.invalidUsername(request.username)

        default: {
          console.error(exception)
          throw exception
        }
      }
    }
  }
}
