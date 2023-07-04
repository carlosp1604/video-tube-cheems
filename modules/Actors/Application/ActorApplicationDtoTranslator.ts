import { ActorApplicationDto } from './ActorApplicationDto'
import { Actor } from '~/modules/Actors/Domain/Actor'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class ActorApplicationDtoTranslator {
  public static fromDomain (actor: Actor): ActorApplicationDto {
    return {
      id: actor.id,
      name: actor.name,
      imageUrl: actor.imageUrl,
      description: actor.description,
      createdAt: actor.createdAt.toISO(),
    }
  }
}
