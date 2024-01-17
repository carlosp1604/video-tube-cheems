import { VideoComponentDto } from './VideoComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'

export interface PostComponentDtoActorDto {
  readonly id: string
  readonly slug: string
  readonly imageUrl: string | null
  readonly name: string
}

export interface PostComponentDtoTagDto {
  readonly id: string
  readonly name: string
  readonly slug: string
}

export interface PostComponentDtoProducerDto {
  readonly id: string
  readonly imageUrl: string | null
  readonly name: string
  readonly slug: string
  readonly brandHexColor: string
}

export interface PostComponentDto {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly video: VideoComponentDto
  readonly date: string
  readonly description: string
  readonly actors: PostComponentDtoActorDto[]
  readonly tags: PostComponentDtoTagDto[]
  readonly producer: PostComponentDtoProducerDto | null
  readonly actor: PostComponentDtoActorDto | null
  readonly postMediaVideoType: PostMediaComponentDto[]
  readonly postMediaEmbedType: PostMediaComponentDto[]
  readonly postMediaImageType: PostMediaComponentDto[]
}
