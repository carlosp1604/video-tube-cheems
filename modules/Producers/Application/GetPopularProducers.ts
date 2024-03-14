import { ProducerApplicationDto } from './ProducerApplicationDto'
import { ProducerApplicationDtoTranslator } from './ProducerApplicationDtoTranslator'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import {Producer} from "~/modules/Producers/Domain/Producer";

export class GetPopularProducers {
  // eslint-disable-next-line no-useless-constructor
  public constructor (private producerRepository: ProducerRepositoryInterface) {}

  public async get (includeProducerSlug: Producer['slug'] | null): Promise<ProducerApplicationDto[]> {
    const producers = await this.producerRepository.getPopular(
      includeProducerSlug ? [includeProducerSlug] : []
    )

    return producers.map((producer) =>
      ProducerApplicationDtoTranslator.fromDomain(producer)
    )
  }
}
