import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import {
  VerificationTokenApplicationTranslator
} from '~/modules/Auth/Application/VerificationTokenApplicationTranslator'
import {
  ValidateTokenApplicationRequestInterface
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationRequestInterface'
import { VerificationTokenApplicationDto } from '~/modules/Auth/Application/VerificationTokenApplicationDto'
import { ValidateTokenApplicationException } from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationException'

export class ValidateToken {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface
  ) {}

  public async validate (request: ValidateTokenApplicationRequestInterface): Promise<VerificationTokenApplicationDto> {
    const verificationToken =
      await this.verificationTokenRepository.findByEmailAndToken(request.userEmail, request.token)

    if (!verificationToken) {
      throw ValidateTokenApplicationException.verificationTokenNotFound(request.userEmail)
    }

    if (verificationToken.tokenHasExpired()) {
      throw ValidateTokenApplicationException.verificationTokenExpired(request.userEmail)
    }

    const user = await this.userRepository.existsByEmail(verificationToken.userEmail)

    if (user && verificationToken.type === 'verify-email') {
      throw ValidateTokenApplicationException.cannotUseVerifyEmailToken(request.userEmail)
    }

    if (!user && verificationToken.type === 'recover-password') {
      throw ValidateTokenApplicationException.cannotUseRecoverPasswordToken(request.userEmail)
    }

    return VerificationTokenApplicationTranslator.fromDomain(verificationToken)
  }
}
