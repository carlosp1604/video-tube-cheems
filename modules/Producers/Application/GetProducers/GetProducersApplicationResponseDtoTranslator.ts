import {
  GetProducersApplicationResponseDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationResponseDto'
import {
  ProducersWithPostsCountWithTotalCount
} from '~/modules/Producers/Domain/ProducerWithCountInterface'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'

export class GetProducersApplicationResponseDtoTranslator {
  public static fromDomain (domainDto: ProducersWithPostsCountWithTotalCount): GetProducersApplicationResponseDto {
    const producers = domainDto.producers.map((producerWithPostsCount) => {
      return {
        producer: ProducerApplicationDtoTranslator.fromDomain(producerWithPostsCount.producer),
        postsNumber: producerWithPostsCount.postsNumber,
      }
    })

    return {
      producers,
      producersNumber: domainDto.producersNumber,
    }
  }
}
