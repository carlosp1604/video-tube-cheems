import { UserRawModel } from '~/modules/Auth/Infrastructure/RawModels/UserRawModel'
import { User as PrismaUserModel } from '@prisma/client'

export class UserModelTranslator {
  public static fromRaw (userRawModel: UserRawModel): PrismaUserModel {
    return {
      id: userRawModel.id,
      name: userRawModel.name,
      username: userRawModel.username,
      email: userRawModel.email,
      imageUrl: userRawModel.image_url,
      language: userRawModel.language,
      password: userRawModel.password,
      createdAt: userRawModel.created_at,
      updatedAt: userRawModel.updated_at,
      deletedAt: userRawModel.deleted_at,
      emailVerified: userRawModel.email_verified,
    }
  }
}
