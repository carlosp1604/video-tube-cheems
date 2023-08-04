import { VerificationTokenRepositoryInterface } from '~/modules/Auth/Domain/VerificationTokenRepositoryInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import {
  PrismaVerificationTokenModelTranslator
} from '~/modules/Auth/Infrastructure/PrismaVerificationTokenModelTranslator'
import { prisma } from '~/persistence/prisma'

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
   * @param deleteExisting Decides whether to delete existing token or not
   */
  public async save (verificationToken: VerificationToken, deleteExisting: boolean): Promise<void> {
    const prismaVerificationTokenModel = PrismaVerificationTokenModelTranslator.toDatabase(verificationToken)

    await prisma.$transaction(async (transaction) => {
      if (deleteExisting) {
        await transaction.verificationToken.deleteMany({
          where: {
            userEmail: verificationToken.userEmail,
          },
        })
      }

      await transaction.verificationToken.create({
        data: {
          ...prismaVerificationTokenModel,
        },
      })
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
