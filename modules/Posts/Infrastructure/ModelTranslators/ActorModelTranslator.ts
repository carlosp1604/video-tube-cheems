import { ObjectionActorModel } from '../ObjectionModels/ObjectionActorModel'
import { Actor } from '../../Domain/Actor'
import { DateTime } from 'luxon'

export class ActorModelTranslator {
  public static toDomain(objectionActorModel: ObjectionActorModel) {
    let deletedAt: DateTime | null = null

    if (objectionActorModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionActorModel.deleted_at)
    }

    return new Actor(
      objectionActorModel.id,
      objectionActorModel.name,
      objectionActorModel.description,
      objectionActorModel.image_url,
      objectionActorModel.views_count,
      DateTime.fromJSDate(objectionActorModel.created_at),
      DateTime.fromJSDate(objectionActorModel.updated_at),
      deletedAt
    )
  }
}