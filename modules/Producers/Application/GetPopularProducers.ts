import { ProducerApplicationDto } from './ProducerApplicationDto'
import { ProducerApplicationDtoTranslator } from './ProducerApplicationDtoTranslator'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'

export class GetPopularProducers {
  // eslint-disable-next-line no-useless-constructor
  public constructor (private producerRepository: ProducerRepositoryInterface) {}

  public async get (): Promise<ProducerApplicationDto[]> {
    const producers = await this.producerRepository.getPopular()

    return producers.map((producer) =>
      ProducerApplicationDtoTranslator.fromDomain(producer)
    )
  }
}
