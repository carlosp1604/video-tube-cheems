import { VideoComponentDto } from './VideoComponentDto'
import {
  VideoDownloadUrlComponentDto,
  VideoEmbedUrlComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'

export interface PostComponentDtoActorDto {
  readonly id: string
  readonly imageUrl: string | null
  readonly name: string
}

export interface PostComponentDtoTagDto {
  readonly id: string
  readonly name: string
}

export interface PostComponentDtoProducerDto {
  readonly id: string
  readonly imageUrl: string | null
  readonly name: string
}

export interface PostComponentDto {
  readonly id: string
  readonly title: string
  readonly video: VideoComponentDto
  readonly date: string
  readonly description: string
  readonly actors: PostComponentDtoActorDto[]
  readonly tags: PostComponentDtoTagDto[]
  readonly producer: PostComponentDtoProducerDto | null
  readonly actor: PostComponentDtoActorDto | null
  readonly downloadUrls: VideoDownloadUrlComponentDto[]
  readonly embedUrls: VideoEmbedUrlComponentDto[]
}
