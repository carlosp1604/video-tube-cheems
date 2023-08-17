import { MetaApplicationDto } from './MetaApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'

export interface PostWithProducerAndMetaApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly slug: string
  readonly publishedAt: string
  readonly producer: ProducerApplicationDto | null
  readonly actor: ActorApplicationDto | null
  readonly meta: MetaApplicationDto[]
  readonly createdAt: string
  readonly translations: ModelTranslationsApplicationDto[]
}
