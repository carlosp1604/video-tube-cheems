import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { VerificationTokenApplicationDto } from '~/modules/Auth/Application/Dtos/VerificationTokenApplicationDto'
import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import {
  VerificationTokenApplicationDtoTranslator
} from '~/modules/Auth/Application/Translators/VerificationTokenApplicationDtoTranslator'
import {
  ValidateTokenApplicationRequestInterface
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationRequestInterface'
import {
  ValidateTokenApplicationException
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationException'

export class ValidateToken {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly verificationTokenRepository: VerificationTokenRepositoryInterface
  ) {}

  public async validate (request: ValidateTokenApplicationRequestInterface): Promise<VerificationTokenApplicationDto> {
    const user = await this.userRepository.findByEmail(request.userEmail, ['verificationToken'])

    if (user === null) {
      const verificationToken =
        await this.verificationTokenRepository.findByEmailAndToken(request.userEmail, request.token)

      if (verificationToken === null) {
        throw ValidateTokenApplicationException.verificationTokenNotFound(request.userEmail)
      }

      if (!verificationToken.isTokenValidFor(VerificationTokenType.CREATE_ACCOUNT)) {
        throw ValidateTokenApplicationException.cannotUseCreateAccountToken(request.userEmail)
      }

      return VerificationTokenApplicationDtoTranslator.fromDomain(verificationToken)
    }

    try {
      user.assertVerificationTokenIsValidFor(VerificationTokenType.RETRIEVE_PASSWORD, request.token)

      return VerificationTokenApplicationDtoTranslator.fromDomain(user.verificationToken as VerificationToken)
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case UserDomainException.userHasNotAVerificationTokenId:
          throw ValidateTokenApplicationException.verificationTokenNotFound(user.email)

        case UserDomainException.verificationTokenIsNotValidForId:
          throw ValidateTokenApplicationException.cannotUseRecoverPasswordToken(user.email)

        case UserDomainException.tokenDoesNotMatchId:
          throw ValidateTokenApplicationException.tokenDoesNotMatch(user.email)

        default:
          throw exception
      }
    }
  }
}
