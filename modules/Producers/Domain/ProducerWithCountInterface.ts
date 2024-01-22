import { Producer } from '~/modules/Producers/Domain/Producer'

export interface ProducerWithPostsCount {
  producer: Producer
  postsNumber: number
}

export interface ProducersWithPostsCountWithTotalCount {
  producers: ProducerWithPostsCount[]
  producersNumber: number
}
