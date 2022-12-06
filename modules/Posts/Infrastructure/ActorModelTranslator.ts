import { ObjectionActorModel } from './ObjectionActorModel'
import { Actor } from '../Domain/Actor'

export class ActorModelTranslator {
  public static toDomain(objectionActorModel: ObjectionActorModel) {
    return new Actor(
      objectionActorModel.id,
      objectionActorModel.name,
      objectionActorModel.description,
      objectionActorModel.image_url,
      objectionActorModel.views_count,
      objectionActorModel.created_at,
      objectionActorModel.updated_at,
      objectionActorModel.deleted_at
    )
  }
}