import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'
import { Actor } from '~/modules/Actors/Domain/Actor'

export class AddActorViewApplicationException extends ApplicationException {
  public static cannotAddActorViewId = 'add_actor_view_cannot_add_actor_view'
  public static actorNotFoundId = 'add_actor_view_actor_not_found'
  public static userNotFoundId = 'add_actor_view_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddActorViewApplicationException.prototype)
  }

  public static actorNotFound (actorSlug: Actor['slug']): AddActorViewApplicationException {
    return new AddActorViewApplicationException(
      `Actor with slug ${actorSlug} was not found`,
      this.actorNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): AddActorViewApplicationException {
    return new AddActorViewApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static cannotAddView (actorId: Actor['id']): AddActorViewApplicationException {
    return new AddActorViewApplicationException(
      `Cannot add a new view for actor with ID ${actorId}`,
      this.cannotAddActorViewId
    )
  }
}
