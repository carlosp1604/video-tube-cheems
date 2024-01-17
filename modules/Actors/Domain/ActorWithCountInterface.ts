import { Actor } from '~/modules/Actors/Domain/Actor'

export interface ActorWithPostsCount {
  actor: Actor
  postsNumber: number
}

export interface ActorsWithPostsCountWithTotalCount {
  actors: ActorWithPostsCount[]
  actorsNumber: number
}
