import { ObjectionPostTagModel } from './ObjectionPostTagModel'
import { PostTag } from '../Domain/PostTag'
import { DateTime } from 'luxon'

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
}