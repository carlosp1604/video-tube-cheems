import { ApplicationException } from '../../Exceptions/Application/ApplicationException'
import { Actor } from '../Domain/Actor'

export class GetActorApplicationException extends ApplicationException {
  public static actorNotFoundId = 'get_actor_actor_not_found'

  public static actorNotFound(actorId: Actor['id']): GetActorApplicationException {
    return new GetActorApplicationException(
      `Actor with ID ${actorId} was not found`,
      this.actorNotFoundId
    )
  }
}