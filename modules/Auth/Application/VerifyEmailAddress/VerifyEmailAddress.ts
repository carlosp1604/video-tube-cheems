import { User } from '~/modules/Auth/Domain/User'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationException'
import {
  VerifyEmailAddressApplicationRequestInterface
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationRequestInterface'

export class VerifyEmailAddress {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface,
    private readonly userEmailSender: UserEmailSenderInterface
  ) {}

  public async verify (request: VerifyEmailAddressApplicationRequestInterface): Promise<void> {
    // TODO: This should evolve to strategy pattern
    switch (request.type) {
      case VerificationTokenType.CREATE_ACCOUNT:
        return this.handleVerifyEmailAddressForCreateAccount(request)
      case VerificationTokenType.RETRIEVE_PASSWORD:
        return this.handleVerifyEmailAddressForRetrievePassword(request)

      default:
        throw VerifyEmailAddressApplicationException.invalidTokenType(request.type)
    }
  }

  private async handleVerifyEmailAddressForCreateAccount (
    request: VerifyEmailAddressApplicationRequestInterface
  ): Promise<void> {
    const emailAddressTaken = await this.userRepository.existsByEmail(request.email)

    if (emailAddressTaken) {
      throw VerifyEmailAddressApplicationException.emailAlreadyRegistered(request.email)
    }

    const existingVerificationToken =
      await this.verificationTokenRepository.findByEmail(request.email)

    if (existingVerificationToken !== null) {
      if (request.sendNewToken) {
        return this.handleSendNewToken(existingVerificationToken, request)
      }

      if (!existingVerificationToken.tokenHasExpired()) {
        throw VerifyEmailAddressApplicationException.existingTokenActive(request.email)
      }
    }

    return this.handleSendNewToken(null, request)
  }

  private async handleVerifyEmailAddressForRetrievePassword (
    request: VerifyEmailAddressApplicationRequestInterface
  ): Promise<void> {
    const user = await this.getUser(request.email)

    const verificationToken = this.setTokenToUser(user, request)

    try {
      await this.verificationTokenRepository.save(verificationToken, true)
    } catch (exception: unknown) {
      console.error(exception)
      throw VerifyEmailAddressApplicationException.cannotCreateVerificationToken(user.email)
    }

    await this.sendVerificationToken(verificationToken)
  }

  private async getUser (userEmail: VerifyEmailAddressApplicationRequestInterface['email']): Promise<User> {
    const user = await this.userRepository.findByEmail(userEmail, ['verificationToken'])

    if (!user) {
      throw VerifyEmailAddressApplicationException.userNotFound(userEmail)
    }

    return user
  }

  private setTokenToUser (user: User, request: VerifyEmailAddressApplicationRequestInterface): VerificationToken {
    try {
      return user.setVerificationToken(VerificationTokenType.RETRIEVE_PASSWORD, request.sendNewToken)
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case UserDomainException.userHasAlreadyAnActiveTokenId:
          throw VerifyEmailAddressApplicationException.existingTokenActive(user.email)

        default:
          throw exception
      }
    }
  }

  private async handleSendNewToken (
    existingToken: VerificationToken | null,
    request: VerifyEmailAddressApplicationRequestInterface
  ): Promise<void> {
    let newTokenToSend: VerificationToken

    try {
      newTokenToSend = User.buildVerificationTokenForAccountCreation(request.email)
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      if (exception.id === UserDomainException.cannotCreateVerificationTokenId) {
        throw VerifyEmailAddressApplicationException.invalidEmailAddress(request.email)
      }

      throw exception
    }

    try {
      await this.verificationTokenRepository.save(newTokenToSend, true)
    } catch (exception: unknown) {
      console.error(exception)

      throw VerifyEmailAddressApplicationException.cannotCreateVerificationToken(request.email)
    }

    await this.sendVerificationToken(newTokenToSend)
  }

  private async sendVerificationToken (verificationToken: VerificationToken): Promise<void> {
    try {
      await this.userEmailSender.sendEmailVerificationEmail(verificationToken.userEmail, verificationToken)
    } catch (exception: unknown) {
      console.error(exception)

      throw VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmail(verificationToken.userEmail)
    }
  }
}
