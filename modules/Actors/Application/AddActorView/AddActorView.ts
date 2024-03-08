import { User } from '~/modules/Auth/Domain/User'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { View } from '~/modules/Views/Domain/View'
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
  constructor (
    private readonly actorRepository: ActorRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async add (request: AddActorViewApplicationRequest): Promise<void> {
    const actor = await this.getActor(request.actorSlug)

    if (request.userId !== null) {
      await this.getUser(request.userId)
    }

    try {
      const actorView = new View(
        randomUUID(),
        actor.id,
        'Actor',
        request.userId,
        DateTime.now()
      )

      await this.actorRepository.createActorView(actor.id, actorView)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddActorViewApplicationException.cannotAddView(actor.id)
    }
  }

  private async getActor (actorSlug: AddActorViewApplicationRequest['actorSlug']): Promise<Actor> {
    const actor = await this.actorRepository.findBySlug(actorSlug)

    if (actor === null) {
      throw AddActorViewApplicationException.actorNotFound(actorSlug)
    }

    return actor as Actor
  }

  private async getUser (userId: AddActorViewApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId as string)

    if (user === null) {
      throw AddActorViewApplicationException.userNotFound(userId as string)
    }

    return user
  }
}
