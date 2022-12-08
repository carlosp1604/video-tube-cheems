import { DateTime } from 'luxon'
import { ObjectionUserModel } from './ObjectionUserModel'
import { User } from '../Domain/User'
import { ModelObject } from 'objection'

type MysqlUserRow = Partial<ModelObject<ObjectionUserModel>>

export class UserModelTranslator {
  public static toDomain(objectionUserModel: ObjectionUserModel) {
    let deletedAt: DateTime | null = null
    let emailVerifiedAt: DateTime | null = null

    if (objectionUserModel.email_verified !== null) {
      emailVerifiedAt = DateTime.fromJSDate(objectionUserModel.email_verified)
    }

    if (objectionUserModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionUserModel.deleted_at)
    }

    return new User (
      objectionUserModel.id,
      objectionUserModel.name,
      objectionUserModel.email,
      objectionUserModel.image_url,
      objectionUserModel.views_count,
      objectionUserModel.language,
      objectionUserModel.password,
      DateTime.fromJSDate(objectionUserModel.created_at),
      DateTime.fromJSDate(objectionUserModel.updated_at),
      emailVerifiedAt,
      deletedAt,
    )
  }

  public static toDatabase(user: User): MysqlUserRow {
    return {
      id: user.id,
      email: user.email,
      email_verified: user.emailVerified?.toJSDate() ?? null,
      name: user.name,
      created_at: user.createdAt.toJSDate(),
      deleted_at: user.deletedAt?.toJSDate() ?? null,
      updated_at: user.updatedAt.toJSDate(),
      views_count: user.viewsCount,
      image_url: user.imageUrl,
      language: user.language,
      password: user.hashedPassword
    }
  }
}