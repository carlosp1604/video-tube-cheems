import { Actor } from '~/modules/Actors/Domain/Actor'

export interface AddActorViewApplicationRequest {
  actorId: Actor['slug']
}
