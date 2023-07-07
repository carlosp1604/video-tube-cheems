import { MetaApplicationDto } from './MetaApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'

export interface PostWithProducerAndMetaApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly slug: string
  readonly publishedAt: string
  readonly producer: ProducerApplicationDto | null
  readonly meta: MetaApplicationDto[]
  readonly createdAt: string
}
