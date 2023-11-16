import { ProducerApplicationDto } from './ProducerApplicationDto'
import { Producer } from '~/modules/Producers/Domain/Producer'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class ProducerApplicationDtoTranslator {
  public static fromDomain (producer: Producer): ProducerApplicationDto {
    let parentProducer: ProducerApplicationDto | null = null

    if (producer.parentProducer !== null) {
      parentProducer = ProducerApplicationDtoTranslator.fromDomain(producer.parentProducer)
    }

    return {
      id: producer.id,
      slug: producer.slug,
      name: producer.name,
      brandHexColor: producer.brandHexColor,
      createdAt: producer.createdAt.toISO(),
      description: producer.description,
      imageUrl: producer.imageUrl,
      parentProducer,
      parentProducerId: producer.parentProducerId,
    }
  }
}
