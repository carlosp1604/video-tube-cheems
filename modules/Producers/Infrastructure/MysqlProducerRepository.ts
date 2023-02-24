import { prisma } from '../../../persistence/prisma'
import { RepositoryOptions } from '../../Posts/Domain/PostRepositoryInterface'
import { Producer } from '../Domain/Producer'
import { ProducerRepositoryInterface } from '../Domain/ProducerRepositoryInterface'
import { ProducerModelTranslator } from './ProducerModelTranslator'

export class MysqlProducerRepository implements ProducerRepositoryInterface {
  public async get(repositoryOptions: RepositoryOptions[]): Promise<Producer[]> {
    const producers = await prisma.producer.findMany()

    return producers.map(
      (producer) => ProducerModelTranslator.toDomain(producer, repositoryOptions)
    )
  }
}