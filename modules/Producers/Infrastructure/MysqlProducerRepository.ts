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
      (producer) => ProducerModelTranslator.toDomain(producer, repositoryOptions)
    )
  }
}
