import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'

export interface GetActorsActorWithPostsCountDto {
  actor: ActorApplicationDto
  postsNumber: number
  actorViews: number
}
export interface GetActorsApplicationResponseDto {
  actors: GetActorsActorWithPostsCountDto[]
  actorsNumber: number
}
