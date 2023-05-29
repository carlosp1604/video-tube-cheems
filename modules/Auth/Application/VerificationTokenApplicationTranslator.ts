import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { VerificationTokenApplicationDto } from '~/modules/Auth/Application/ VerificationTokenApplicationDto'

export class VerificationTokenApplicationTranslator {
  public static fromDomain (verificationToken: VerificationToken): VerificationTokenApplicationDto {
    return {
      id: verificationToken.id,
      token: verificationToken.token,
      type: verificationToken.type,
      expiresAt: verificationToken.expiresAt.toISO(),
      userEmail: verificationToken.userEmail,
    }
  }
}
