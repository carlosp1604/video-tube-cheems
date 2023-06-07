import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationException'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import {
  CreateUserApplicationRequestInterface
} from '~/modules/Auth/Application/CreateUser/CreateUserApplicationRequestInterface'
import { PasswordValidator } from '~/modules/Shared/Domain/PasswordValidator'

export class CreateUser {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface
  ) {}

  public async create (request: CreateUserApplicationRequestInterface): Promise<void> {
    await this.checkTokenExistsAndValidate(request.email, request.token)

    await this.checkIfEmailOrUsernameAreBeingUsed(request.email, request.username)

    const user = await this.buildUser(request)

    try {
      await this.userRepository.save(user)
    } catch (exception: unknown) {
      console.error(exception)

      throw CreateUserApplicationException.cannotCreateUser(request.email)
    }
  }

  private async checkTokenExistsAndValidate (
    userEmail: VerificationToken['userEmail'],
    token: VerificationToken['token']
  ): Promise<void> {
    const verificationToken = await this.verificationTokenRepository
      .findByEmailAndToken(userEmail, token)

    if (verificationToken === null || !verificationToken.isTokenValidFor(VerificationTokenType.CREATE_ACCOUNT)) {
      throw CreateUserApplicationException.verificationTokenIsNotValid(userEmail)
    }
  }

  private async checkIfEmailOrUsernameAreBeingUsed (
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
    const userId = randomUUID()

    const hashedPassword = await this.validateAndHashPassword(request.password)

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

        case ValidationException.invalidNameId:
          throw CreateUserApplicationException.invalidName(request.name)

        default: {
          console.error(exception)
          throw exception
        }
      }
    }
  }

  private async validateAndHashPassword (password: CreateUserApplicationRequestInterface['password']): Promise<string> {
    let validatedPassword

    try {
      validatedPassword = (new PasswordValidator()).validate(password)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidPasswordId) {
        throw CreateUserApplicationException.invalidPassword(password)
      }

      throw exception
    }

    return this.cryptoService.hash(validatedPassword)
  }
}
