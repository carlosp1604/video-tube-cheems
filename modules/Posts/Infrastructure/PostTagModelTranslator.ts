import { ObjectionPostTagModel } from './ObjectionPostTagModel'
import { PostTag } from '../Domain/PostTag'

export class PostTagModelTranslator {
  public static toDomain(
    objectionPostTagModel: ObjectionPostTagModel,
  ) {
    return new PostTag (
      objectionPostTagModel.id,
      objectionPostTagModel.name,
      objectionPostTagModel.description,
      objectionPostTagModel.image_url,
      objectionPostTagModel.created_at,
      objectionPostTagModel.updated_at,
      objectionPostTagModel.deleted_at
    )
  }
}