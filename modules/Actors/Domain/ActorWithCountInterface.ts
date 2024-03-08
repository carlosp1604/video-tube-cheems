import { Actor } from '~/modules/Actors/Domain/Actor'

export interface ActorWithPostsWithViewsCount {
  actor: Actor
  postsNumber: number
  actorViews: number
}

export interface ActorsWithPostsCountViewsCountWithTotalCount {
  actors: ActorWithPostsWithViewsCount[]
  actorsNumber: number
}
