import { PostMeta } from '../Domain/PostMeta'
import { ObjectionPostMetaModel } from './ObjectionPostMetaModel'
import { DateTime } from 'luxon'

export class PostMetaModelTranslator {
  public static toDomain(objectionPostMetaModel: ObjectionPostMetaModel): PostMeta {
    let deletedAt: DateTime | null = null

    if (objectionPostMetaModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionPostMetaModel.deleted_at)
    }

    return new PostMeta(
      objectionPostMetaModel.type,
      objectionPostMetaModel.value,
      objectionPostMetaModel.post_id,
      DateTime.fromJSDate(objectionPostMetaModel.created_at),
      DateTime.fromJSDate(objectionPostMetaModel.updated_at),
      deletedAt
    )
  }
}