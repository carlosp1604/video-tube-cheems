import { Producer } from '../Domain/Producer'
import { ProducerApplicationDto } from './ProducerApplicationDto'

export class ProducerApplicationDtoTranslator {
  public static fromDomain(producer: Producer): ProducerApplicationDto {
    let parentProducer: ProducerApplicationDto | null = null
    if (producer.parentProducer !== null) {
      parentProducer = ProducerApplicationDtoTranslator.fromDomain(producer.parentProducer)
    }

    return { 
      id: producer.id,
      name: producer.name,
      brandHexColor: producer.brandHexColor,
      createdAt: producer.createdAt.toISO(),
      description: producer.description,
      imageUrl: producer.imageUrl,
      parentProducer: parentProducer,
      parentProducerId: producer.parentProducerId
    }
  } 
}