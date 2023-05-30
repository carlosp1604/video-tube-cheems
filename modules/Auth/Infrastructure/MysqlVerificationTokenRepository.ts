import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { prisma } from '~/persistence/prisma'
import {
  PrismaVerificationTokenModelTranslator
} from '~/modules/Auth/Infrastructure/PrismaVerificationTokenModelTranslator'

export class MysqlVerificationTokenRepository implements VerificationTokenRepositoryInterface {
  /**
   * Get a VerificationToken from the database given its user email and token values
   * @param userEmail VerificationToken User Email
   * @param token VerificationToken token
   * @returns VerificationToken if found or null
   */
  public async findByEmailAndToken (
    userEmail: VerificationToken['userEmail'],
    token: VerificationToken['token']
  ): Promise<VerificationToken | null> {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        userEmail,
      },
    })

    if (verificationToken === null) {
      return null
    }

    return PrismaVerificationTokenModelTranslator.toDomain(verificationToken)
  }

  /**
   * Get a VerificationToken from the database given its user email
   * @param userEmail VerificationToken User Email
   * @returns VerificationToken if found or null
   */
  public async findByEmail (userEmail: VerificationToken['userEmail']): Promise<VerificationToken | null> {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        userEmail,
      },
    })

    if (verificationToken === null) {
      return null
    }

    return PrismaVerificationTokenModelTranslator.toDomain(verificationToken)
  }

  /**
   * Persist a VerificationToken in the database
   * @param verificationToken VerificationToken to insert
   */
  public async save (verificationToken: VerificationToken): Promise<void> {
    const prismaVerificationTokenModel = PrismaVerificationTokenModelTranslator.toDatabase(verificationToken)

    await prisma.verificationToken.create({
      data: {
        ...prismaVerificationTokenModel,
      },
    })
  }

  /**
   * Remove a VerificationToken from the database
   * @param verificationToken VerificationToken to remove
   */
  public async delete (verificationToken: VerificationToken): Promise<void> {
    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    })
  }
}
