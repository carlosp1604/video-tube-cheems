import { PostMeta } from '../Domain/PostMeta'
import { ObjectionPostMetaModel } from './ObjectionPostMetaModel'
import { DateTime } from 'luxon'
import { ModelObject } from 'objection'

type MysqlPostMetaRow = Partial<ModelObject<ObjectionPostMetaModel>>

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

  public static toDatabase(postMeta: PostMeta): MysqlPostMetaRow {
    return {
      type: postMeta.type,
      post_id: postMeta.postId,
      value: postMeta.value,
      created_at: postMeta.createdAt.toJSDate(),
      deleted_at: postMeta.deletedAt?.toJSDate() ?? null,
      updated_at: postMeta.updatedAt.toJSDate(),
    }
  }
}