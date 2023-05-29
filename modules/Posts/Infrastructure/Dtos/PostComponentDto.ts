import { ActorComponentDto } from './ActorComponentDto'
import { TagComponentDto } from './TagComponentDto'
import { VideoComponentDto } from './VideoComponentDto'
import { PostComponentProducerDto } from '~/modules/Producers/Infrastructure/Dtos/PostComponentProducerDto'
import { PostReactionComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostReactionComponentDto'

export interface PostComponentDto {
  readonly id: string
  readonly title: string
  readonly video: VideoComponentDto
  readonly date: string
  readonly views: number
  readonly reactions: number
  readonly comments: number
  readonly description: string
  readonly actors: ActorComponentDto[]
  readonly tags: TagComponentDto[]
  readonly producer: PostComponentProducerDto | null
  readonly userReaction: PostReactionComponentDto | null
}
