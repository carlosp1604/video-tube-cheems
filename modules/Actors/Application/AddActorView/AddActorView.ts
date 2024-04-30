import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { Actor } from '~/modules/Actors/Domain/Actor'
import {
  AddActorViewApplicationException
} from '~/modules/Actors/Application/AddActorView/AddActorViewApplicationException'
import {
  AddActorViewApplicationRequest
} from '~/modules/Actors/Application/AddActorView/AddActorViewApplicationRequest'

export class AddActorView {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly actorRepository: ActorRepositoryInterface) {}

  public async add (request: AddActorViewApplicationRequest): Promise<void> {
    const actor = await this.getActor(request.actorId)

    try {
      await this.actorRepository.addActorView(actor.id)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddActorViewApplicationException.cannotAddView(actor.id)
    }
  }

  private async getActor (actorId: AddActorViewApplicationRequest['actorId']): Promise<Actor> {
    const actor = await this.actorRepository.findById(actorId)

    if (actor === null) {
      throw AddActorViewApplicationException.actorNotFound(actorId)
    }

    return actor as Actor
  }
}
