import { ActorApplicationDto } from './ActorApplicationDto'
import { ActorApplicationDtoTranslator } from './ActorApplicationDtoTranslator'
import { GetActorApplicationException } from './GetActorApplicationException'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { Actor } from '~/modules/Actors/Domain/Actor'

export class GetActor {
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly actorRepository: ActorRepositoryInterface) {}

  public async get (actorId: Actor['id']): Promise<ActorApplicationDto> {
    const actor = await this.actorRepository.findById(actorId)

    if (actor === null) {
      throw GetActorApplicationException.actorNotFound(actorId)
    }

    return ActorApplicationDtoTranslator.fromDomain(actor)
  }
}
