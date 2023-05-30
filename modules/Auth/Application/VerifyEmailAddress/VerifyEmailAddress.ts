import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { User } from '~/modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationException'
import * as crypto from 'crypto'
import {
  VerifyEmailAddressApplicationRequestInterface
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationRequestInterface'
import { RecoverPasswordApplicationRequest } from '~/modules/Auth/Application/RecoverPasswordApplicationRequest'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'

export class VerifyEmailAddress {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface,
    private readonly userEmailSender: UserEmailSenderInterface
  ) {}

  public async verify (request: VerifyEmailAddressApplicationRequestInterface): Promise<void> {
    const emailAddressTaken = await this.userRepository.existsByEmail(request.email)

    if (emailAddressTaken) {
      throw VerifyEmailAddressApplicationException.emailAlreadyRegistered(request.email)
    }

    const existingVerificationToken = await this.verificationTokenRepository.findByEmail(request.email)

    if (existingVerificationToken !== null) {
      if (request.sendNewToken) {
        return this.handleSendNewToken(existingVerificationToken, request)
      }

      return this.handleExistingToken(existingVerificationToken, request)
    }

    return this.handleSendNewToken(null, request)
  }

  private async handleSendNewToken (
    existingToken: VerificationToken | null,
    request: RecoverPasswordApplicationRequest
  ): Promise<void> {
    const newTokenToSend = this.buildVerificationToken(request.email)

    if (existingToken) {
      // TODO: Handle possible errors
      await this.verificationTokenRepository.delete(existingToken)
    }

    await this.saveAndSendVerificationToken(newTokenToSend)
  }

  private async handleExistingToken (
    existingToken: VerificationToken,
    request: RecoverPasswordApplicationRequest
  ): Promise<void> {
    if (existingToken.expiresAt > DateTime.now()) {
      throw VerifyEmailAddressApplicationException.existingTokenActive(request.email)
    }

    return this.handleSendNewToken(existingToken, request)
  }

  private async saveAndSendVerificationToken (
    verificationToken: VerificationToken
  ): Promise<void> {
    try {
      await this.userEmailSender.sendEmailVerificationEmail(verificationToken.userEmail, verificationToken)

      await this.verificationTokenRepository.save(verificationToken)
    } catch (exception: unknown) {
      console.error(exception)

      throw VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmail(verificationToken.userEmail)
    }
  }

  private buildVerificationToken (
    userEmail: User['email']
  ): VerificationToken {
    const tokenId = crypto.randomUUID()
    const token = this.cryptoService.randomString()

    const nowDate = DateTime.now()

    try {
      return new VerificationToken(
        tokenId,
        token,
        userEmail,
        VerificationTokenType.VERIFY_EMAIL,
        nowDate.plus({ minute: 60 }),
        nowDate
      )
    } catch (exception: unknown) {
      console.error(exception)

      throw VerifyEmailAddressApplicationException.cannotCreateVerificationToken(userEmail)
    }
  }
}
