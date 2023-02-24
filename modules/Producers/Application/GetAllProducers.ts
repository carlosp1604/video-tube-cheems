import { ProducerRepositoryInterface } from '../Domain/ProducerRepositoryInterface'
import { ProducerApplicationDto } from './ProducerApplicationDto'
import { ProducerApplicationDtoTranslator } from './ProducerApplicationDtoTranslator'

export class GetAllProducers {
  public constructor(
    private producerRepository: ProducerRepositoryInterface
  ) {}

  public async get(): Promise<ProducerApplicationDto[]> {
    const producers = await this.producerRepository.get([])

    return producers.map((producer) => 
      ProducerApplicationDtoTranslator.fromDomain(producer)
    )
  }
}