import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Actor } from '~/modules/Actors/Domain/Actor'

export class AddActorViewApplicationException extends ApplicationException {
  public static cannotAddActorViewId = 'add_actor_view_cannot_add_actor_view'
  public static actorNotFoundId = 'add_actor_view_actor_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddActorViewApplicationException.prototype)
  }

  public static actorNotFound (actorId: Actor['id']): AddActorViewApplicationException {
    return new AddActorViewApplicationException(
      `Actor with ID ${actorId} was not found`,
      this.actorNotFoundId
    )
  }

  public static cannotAddView (actorId: Actor['id']): AddActorViewApplicationException {
    return new AddActorViewApplicationException(
      `Cannot add a new view for actor with ID ${actorId}`,
      this.cannotAddActorViewId
    )
  }
}
