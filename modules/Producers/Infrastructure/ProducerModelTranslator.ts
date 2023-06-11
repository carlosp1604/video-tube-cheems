import { DateTime } from 'luxon'
import { Producer as PrismaProducerModel } from '@prisma/client'
import { ProducerWithParent } from './PrismaProducerModel'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { Producer } from '~/modules/Producers/Domain/Producer'

export class ProducerModelTranslator {
  public static toDomain (
    prismaProducerModel: PrismaProducerModel,
    options: RepositoryOptions[]
  ) {
    let deletedAt: DateTime | null = null

    if (prismaProducerModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaProducerModel.deletedAt)
    }

    const producer = new Producer(
      prismaProducerModel.id,
      prismaProducerModel.name,
      prismaProducerModel.description,
      prismaProducerModel.imageUrl,
      prismaProducerModel.parentProducerId,
      prismaProducerModel.brandHexColor,
      DateTime.fromJSDate(prismaProducerModel.createdAt),
      DateTime.fromJSDate(prismaProducerModel.updatedAt),
      deletedAt
    )

    if (options.includes('producer.parentProducer')) {
      const producerWithParent = prismaProducerModel as ProducerWithParent

      if (producerWithParent.parentProducer !== null) {
        const parentProducerDomain = ProducerModelTranslator.toDomain(producerWithParent.parentProducer, [])

        producer.setParentProducer(parentProducerDomain)
      }
    }

    return producer
  }

  public static toDatabase (producer: Producer): PrismaProducerModel {
    return {
      id: producer.id,
      brandHexColor: producer.brandHexColor,
      imageUrl: producer.imageUrl,
      name: producer.name,
      description: producer.description,
      parentProducerId: producer.parentProducerId,
      createdAt: producer.createdAt.toJSDate(),
      deletedAt: producer.deletedAt?.toJSDate() ?? null,
      updatedAt: producer.updatedAt.toJSDate(),
    }
  }
}
