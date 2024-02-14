import { User } from 'next-auth'
import { Actor } from '~/modules/Actors/Domain/Actor'

export interface AddActorViewApplicationRequest {
  userId: User['id'] | null
  actorSlug: Actor['slug']
}
