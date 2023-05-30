import { MetaApplicationDto } from './MetaApplicationDto'
import { TagApplicationDto } from './TagApplicationDto'
import { CommentApplicationDto } from './CommentApplicationDto'
import { ReactionApplicationDto } from './ReactionApplicationDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'

export interface PostApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly publishedAt: string
  readonly producer: ProducerApplicationDto | null
  readonly meta: MetaApplicationDto[]
  readonly actors: ActorApplicationDto[]
  readonly tags: TagApplicationDto[]
  readonly comments: CommentApplicationDto[]
  readonly reactions: ReactionApplicationDto[]
  readonly createdAt: string
}
