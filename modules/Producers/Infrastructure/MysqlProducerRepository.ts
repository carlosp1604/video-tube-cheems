import { ProducerModelTranslator } from './ProducerModelTranslator'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import { prisma } from '~/persistence/prisma'

export class MysqlProducerRepository implements ProducerRepositoryInterface {
  // TODO: Paginate this when producers number increase
  public async get (repositoryOptions: RepositoryOptions[]): Promise<Producer[]> {
    const producers = await prisma.producer.findMany()

    return producers.map(
      (producer) => ProducerModelTranslator.toDomain(producer)
    )
  }

  /**
   * Find a Producer given its slug
   * @param producerSlug Producer Slug
   * @return Producer if found or null
   */
  public async findBySlug (producerSlug: Producer['slug']): Promise<Producer | null> {
    const producer = await prisma.producer.findFirst({
      where: {
        slug: producerSlug,
        deletedAt: null,
      },
    })

    if (producer === null) {
      return null
    }

    return ProducerModelTranslator.toDomain(producer)
  }
}
