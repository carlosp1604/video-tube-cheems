import { MetaApplicationDto } from './MetaApplicationDto'
import { ActorApplicationDto } from './ActorApplicationDto'
import { TagApplicationDto } from './TagApplicationDto'
import { CommentApplicationDto } from './CommentApplicationDto'
import { ReactionApplicationDto } from './ReactionApplicationDto'

export interface PostApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly viewsCount: number
  readonly publishedAt: string
  readonly meta: MetaApplicationDto[]
  readonly actors: ActorApplicationDto[]
  readonly tags: TagApplicationDto[]
  readonly comments: CommentApplicationDto[]
  readonly reactions: ReactionApplicationDto[]
}