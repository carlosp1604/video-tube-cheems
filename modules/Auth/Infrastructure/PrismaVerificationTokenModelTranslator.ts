import { DateTime } from 'luxon'
import { VerificationToken as PrismaVerificationTokenModel } from '@prisma/client'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export class PrismaVerificationTokenModelTranslator {
  public static toDomain (prismaVerificationToken: PrismaVerificationTokenModel) {
    return new VerificationToken(
      prismaVerificationToken.id,
      prismaVerificationToken.token,
      prismaVerificationToken.userEmail,
      prismaVerificationToken.type,
      DateTime.fromJSDate(prismaVerificationToken.expiresAt),
      DateTime.fromJSDate(prismaVerificationToken.createdAt)
    )
  }

  public static toDatabase (verificationToken: VerificationToken): PrismaVerificationTokenModel {
    return {
      id: verificationToken.id,
      userEmail: verificationToken.userEmail,
      token: verificationToken.token,
      type: verificationToken.type,
      expiresAt: verificationToken.expiresAt.toJSDate(),
      createdAt: verificationToken.createdAt.toJSDate(),
    }
  }
}
