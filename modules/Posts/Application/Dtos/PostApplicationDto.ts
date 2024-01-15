import { MetaApplicationDto } from './MetaApplicationDto'
import { TagApplicationDto } from '../../../PostTag/Application/TagApplicationDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'

export interface PostApplicationDto {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly description: string
  readonly slug: string
  readonly publishedAt: string
  readonly producer: ProducerApplicationDto | null
  readonly actor: ActorApplicationDto | null
  readonly meta: MetaApplicationDto[]
  readonly actors: ActorApplicationDto[]
  readonly tags: TagApplicationDto[]
  readonly translations: ModelTranslationsApplicationDto[]
  readonly postMedia: PostMediaApplicationDto[]
  readonly createdAt: string
}
