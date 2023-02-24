import { MetaApplicationDto } from './MetaApplicationDto'
import { ActorApplicationDto } from '../../../Actors/Application/ActorApplicationDto'
import { TagApplicationDto } from './TagApplicationDto'
import { CommentApplicationDto } from './CommentApplicationDto'
import { ReactionApplicationDto } from './ReactionApplicationDto'
import { ProducerApplicationDto } from '../../../Producers/Application/ProducerApplicationDto'

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