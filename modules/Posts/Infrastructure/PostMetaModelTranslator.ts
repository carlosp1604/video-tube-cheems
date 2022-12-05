import { PostMeta } from '../Domain/PostMeta'
import { ObjectionPostMetaModel } from './ObjectionPostMetaModel'

export class PostMetaModelTranslator {
  public static toDomain(objectionPostMetaModel: ObjectionPostMetaModel): PostMeta {
    return new PostMeta(
      objectionPostMetaModel.type,
      objectionPostMetaModel.value,
      objectionPostMetaModel.post_id,
      objectionPostMetaModel.created_at,
      objectionPostMetaModel.updated_at,
      objectionPostMetaModel.deleted_at
    )
  }
}