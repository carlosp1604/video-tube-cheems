import { Producer } from '~/modules/Producers/Domain/Producer'

export interface ProducerWithPostsWithViewsCount {
  producer: Producer
  postsNumber: number
  producerViews: number
}

export interface ProducersWithPostsCountViewsCountWithTotalCount {
  producers: ProducerWithPostsWithViewsCount[]
  producersNumber: number
}
