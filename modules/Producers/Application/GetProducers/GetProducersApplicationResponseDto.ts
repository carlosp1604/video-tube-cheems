import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'

export interface GetProducersProducerWithPostsCountDto {
  producer: ProducerApplicationDto
  postsNumber: number
  producerViews: number
}
export interface GetProducersApplicationResponseDto {
  producers: GetProducersProducerWithPostsCountDto[]
  producersNumber: number
}
