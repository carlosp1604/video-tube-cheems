import {
  GetActorBySlugApplicationResponseDto
} from '~/modules/Actors/Application/GetPostBySlug/GetActorBySlugApplicationResponseDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import { Producer } from '~/modules/Producers/Domain/Producer'
import {
  GetProducerBySlugApplicationException
} from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlugApplicationException'

export class GetProducerBySlug {
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly producerRepository: ProducerRepositoryInterface) {}

  public async get (producerSlug: Producer['slug']): Promise<GetActorBySlugApplicationResponseDto> {
    const actor = await this.producerRepository.findBySlug(producerSlug)

    if (actor === null) {
      throw GetProducerBySlugApplicationException.producerNotFound(producerSlug)
    }

    return ActorApplicationDtoTranslator.fromDomain(actor)
  }
}
