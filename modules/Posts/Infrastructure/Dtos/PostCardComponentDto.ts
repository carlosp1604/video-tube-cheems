import { PostAnimationDto } from './PostAnimationDto'

export interface ProducerPostCardComponentDto {
  readonly id: string
  readonly name: string
  readonly imageUrl: string | null
}

export interface PostCardComponentDto {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly thumb: string
  readonly animation: PostAnimationDto | null
  readonly views: number
  readonly date: string
  readonly producer: ProducerPostCardComponentDto | null
  readonly duration: string
}
