import { Actor } from '~/modules/Actors/Domain/Actor'
import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetActorBySlugApplicationException extends ApplicationException {
  public static actorNotFoundId = 'get_actor_by_slug_actor_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetActorBySlugApplicationException.prototype)
  }

  public static actorNotFound (actorSlug: Actor['slug']): GetActorBySlugApplicationException {
    return new GetActorBySlugApplicationException(
      `Actor with slug ${actorSlug} was not found`,
      this.actorNotFoundId
    )
  }
}
