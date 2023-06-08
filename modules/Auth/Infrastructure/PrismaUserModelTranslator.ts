import { User } from '../Domain/User'
import { DateTime } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { UserRepositoryOptions } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User as PrismaUserModel } from '@prisma/client'
import { UserWithVerificationToken } from '~/modules/Auth/Infrastructure/PrismaModels/PrismaUserModels'
import {
  PrismaVerificationTokenModelTranslator
} from '~/modules/Auth/Infrastructure/PrismaVerificationTokenModelTranslator'

export class PrismaUserModelTranslator {
  public static toDomain (prismaUserModel: PrismaUserModel, options: UserRepositoryOptions[] = []) {
    let deletedAt: DateTime | null = null
    let emailVerifiedAt: DateTime | null = null

    if (prismaUserModel.emailVerified !== null) {
      emailVerifiedAt = DateTime.fromJSDate(prismaUserModel.emailVerified)
    }

    if (prismaUserModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaUserModel.deletedAt)
    }

    let verificationTokenRelationship: Relationship<VerificationToken | null> = Relationship.notLoaded()

    if (options.includes('verificationToken')) {
      const prismaUserModelWithVerificationToken = prismaUserModel as UserWithVerificationToken

      if (prismaUserModelWithVerificationToken.verificationToken !== null) {
        const domainVerificationToken =
          PrismaVerificationTokenModelTranslator.toDomain(prismaUserModelWithVerificationToken.verificationToken)

        verificationTokenRelationship = Relationship.initializeRelation(domainVerificationToken)
      }
    }

    return new User(
      prismaUserModel.id,
      prismaUserModel.name,
      prismaUserModel.username,
      prismaUserModel.email,
      prismaUserModel.imageUrl,
      prismaUserModel.language,
      prismaUserModel.password,
      DateTime.fromJSDate(prismaUserModel.createdAt),
      DateTime.fromJSDate(prismaUserModel.updatedAt),
      emailVerifiedAt,
      deletedAt,
      verificationTokenRelationship
    )
  }

  public static toDatabase (user: User): PrismaUserModel {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified?.toJSDate() ?? null,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt.toJSDate(),
      deletedAt: user.deletedAt?.toJSDate() ?? null,
      updatedAt: user.updatedAt.toJSDate(),
      imageUrl: user.imageUrl,
      language: user.language,
      password: user.password,
    }
  }
}
