import { GetActorBySlugApplicationException } from './GetActorBySlugApplicationException'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { Actor } from '~/modules/Actors/Domain/Actor'
import {
  GetActorBySlugApplicationResponseDto
} from '~/modules/Actors/Application/GetActorBySlug/GetActorBySlugApplicationResponseDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'

export class GetActorBySlug {
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly actorRepository: ActorRepositoryInterface) {}

  public async get (actorSlug: Actor['slug']): Promise<GetActorBySlugApplicationResponseDto> {
    const actor = await this.actorRepository.findBySlug(actorSlug)

    if (actor === null) {
      throw GetActorBySlugApplicationException.actorNotFound(actorSlug)
    }

    return ActorApplicationDtoTranslator.fromDomain(actor)
  }
}
