
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import { Producer } from '~/modules/Producers/Domain/Producer'
import {
  GetProducerBySlugApplicationException
} from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlugApplicationException'
import {
  GetProducerBySlugApplicationResponseDto
} from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlugApplicationResponseDto'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'

export class GetProducerBySlug {
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly producerRepository: ProducerRepositoryInterface) {}

  public async get (producerSlug: Producer['slug']): Promise<GetProducerBySlugApplicationResponseDto> {
    const actor = await this.producerRepository.findBySlug(producerSlug)

    if (actor === null) {
      throw GetProducerBySlugApplicationException.producerNotFound(producerSlug)
    }

    return ProducerApplicationDtoTranslator.fromDomain(actor)
  }
}
