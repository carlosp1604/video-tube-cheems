import { DateTime } from 'luxon'
import { User } from '../Domain/User'
import { User as PrismaUserModel } from '@prisma/client'

export class UserModelTranslator {
  public static toDomain(prismaUserModel: PrismaUserModel) {
    let deletedAt: DateTime | null = null
    let emailVerifiedAt: DateTime | null = null

    if (prismaUserModel.emailVerified !== null) {
      emailVerifiedAt = DateTime.fromJSDate(prismaUserModel.emailVerified)
    }

    if (prismaUserModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaUserModel.deletedAt)
    }

    return new User (
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
    )
  }

  public static toDatabase(user: User): PrismaUserModel {
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