import { Actor } from '../Domain/Actor'
import { ActorApplicationDto } from './ActorApplicationDto'

export class ActorApplicationDtoTranslator {
  public static fromDomain(actor: Actor): ActorApplicationDto {
    return {
      id: actor.id,
      name: actor.name,
      imageUrl: actor.imageUrl,
      description: actor.description,
      createdAt: actor.createdAt.toISO()
    }
  }
}