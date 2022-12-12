import { ObjectionPostTagModel } from './ObjectionPostTagModel'
import { PostTag } from '../Domain/PostTag'
import { DateTime } from 'luxon'
import { ModelObject } from 'objection'

type MysqlPostTagRow = Partial<ModelObject<ObjectionPostTagModel>>

export class PostTagModelTranslator {
  public static toDomain(
    objectionPostTagModel: ObjectionPostTagModel,
  ) {
    let deletedAt: DateTime | null = null

    if (objectionPostTagModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionPostTagModel.deleted_at)
    }

    return new PostTag (
      objectionPostTagModel.id,
      objectionPostTagModel.name,
      objectionPostTagModel.description,
      objectionPostTagModel.image_url,
      DateTime.fromJSDate(objectionPostTagModel.created_at),
      DateTime.fromJSDate(objectionPostTagModel.updated_at),
      deletedAt
    )
  }

  public static toDatabase(postTag: PostTag): MysqlPostTagRow {
    return {
      id: postTag.id,
      image_url: postTag.imageUrl,
      name: postTag.name,
      description: postTag.description,
      created_at: postTag.createdAt.toJSDate(),
      deleted_at: postTag.deletedAt?.toJSDate() ?? null,
      updated_at: postTag.updatedAt.toJSDate(),
    }
  }
}