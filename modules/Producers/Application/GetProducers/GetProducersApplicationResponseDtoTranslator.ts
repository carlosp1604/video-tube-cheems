import {
  GetProducersApplicationResponseDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationResponseDto'
import {
  ProducersWithPostsCountViewsCountWithTotalCount
} from '~/modules/Producers/Domain/ProducerWithCountInterface'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'

export class GetProducersApplicationResponseDtoTranslator {
  public static fromDomain (
    domainDto: ProducersWithPostsCountViewsCountWithTotalCount
  ): GetProducersApplicationResponseDto {
    const producers = domainDto.producers.map((producerWithPostsCount) => {
      return {
        producer: ProducerApplicationDtoTranslator.fromDomain(producerWithPostsCount.producer),
        postsNumber: producerWithPostsCount.postsNumber,
        producerViews: producerWithPostsCount.producerViews,
      }
    })

    return {
      producers,
      producersNumber: domainDto.producersNumber,
    }
  }
}
