import { PostComponentProducerDto } from '../../../Producers/Infrastructure/Dtos/PostComponentProducerDto'
import { ActorComponentDto } from './ActorComponentDto'
import { TagComponentDto } from './TagComponentDto'
import { VideoComponentDto } from './VideoComponentDto'

export interface PostComponentDto {
  readonly title: string
  readonly video: VideoComponentDto,
  readonly date: string
  readonly views: number
  readonly reactions: number
  readonly description: string
  readonly actors: ActorComponentDto[],
  readonly tags: TagComponentDto[],
  readonly producer: PostComponentProducerDto | null,
}