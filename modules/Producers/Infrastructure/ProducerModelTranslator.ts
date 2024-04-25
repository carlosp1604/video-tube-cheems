import { DateTime } from 'luxon'
import { Producer as PrismaProducerModel } from '@prisma/client'
import { ProducerWithParent } from './PrismaProducerModel'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'

export class ProducerModelTranslator {
  public static toDomain (prismaProducerModel: PrismaProducerModel) {
    let deletedAt: DateTime | null = null

    if (prismaProducerModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaProducerModel.deletedAt)
    }

    const producerWithParent = prismaProducerModel as ProducerWithParent

    let parentProducer: Producer | null = null

    if (producerWithParent.parentProducer) {
      parentProducer = ProducerModelTranslator.toDomain(producerWithParent.parentProducer)
    }

    const parentProducerRelationship: Relationship<Producer | null> = Relationship.initializeRelation(parentProducer)

    return new Producer(
      prismaProducerModel.id,
      prismaProducerModel.slug,
      prismaProducerModel.name,
      prismaProducerModel.description,
      prismaProducerModel.imageUrl,
      prismaProducerModel.parentProducerId,
      prismaProducerModel.brandHexColor,
      DateTime.fromJSDate(prismaProducerModel.createdAt),
      DateTime.fromJSDate(prismaProducerModel.updatedAt),
      deletedAt,
      parentProducerRelationship
    )
  }

  public static toDatabase (producer: Producer, viewsCount: number): PrismaProducerModel {
    return {
      id: producer.id,
      slug: producer.slug,
      brandHexColor: producer.brandHexColor,
      imageUrl: producer.imageUrl,
      name: producer.name,
      description: producer.description,
      parentProducerId: producer.parentProducerId,
      createdAt: producer.createdAt.toJSDate(),
      deletedAt: producer.deletedAt?.toJSDate() ?? null,
      updatedAt: producer.updatedAt.toJSDate(),
      viewsCount: BigInt(viewsCount),
    }
  }
}
