import { ProducerModelTranslator } from './ProducerModelTranslator'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import { prisma } from '~/persistence/prisma'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import {
  ProducersWithPostsCountWithTotalCount,
  ProducerWithPostsCount
} from '~/modules/Producers/Domain/ProducerWithCountInterface'
import { Prisma } from '@prisma/client'
import ProducerOrderByWithRelationInput = Prisma.ProducerOrderByWithRelationInput
import { ProducerSortingOption } from '~/modules/Producers/Domain/ProducerSorting'

export class MysqlProducerRepository implements ProducerRepositoryInterface {
  // TODO: Paginate this when producers number increase
  public async get (): Promise<Producer[]> {
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

  /**
   * Find Producers based on sorting criteria
   * @param offset Records offset
   * @param limit Records limit
   * @param sortingOption Sorting option
   * @param sortingCriteria Sorting criteria
   * @return ProducersWithPostsCountWithTotalCount
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria
  ): Promise<ProducersWithPostsCountWithTotalCount> {
    const whereClause: Prisma.ProducerWhereInput | undefined = {
      deletedAt: null,
    }

    const producersSortCriteria = MysqlProducerRepository.buildOrder(sortingOption, sortingCriteria)

    const [producers, producersNumber] = await prisma.$transaction([
      prisma.producer.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  publishedAt: {
                    not: null,
                    lte: new Date(),
                  },
                },
              },
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: producersSortCriteria,
      }),
      prisma.producer.count({
        where: whereClause,
      }),
    ])

    const producersWithPostsNumber: ProducerWithPostsCount[] = producers.map((producer) => {
      return {
        producer: ProducerModelTranslator.toDomain(producer),
        postsNumber: producer._count.posts,
      }
    })

    return {
      producers: producersWithPostsNumber,
      producersNumber,
    }
  }

  private static buildOrder (
    sortingOption: ProducerSortingOption,
    sortingCriteria: SortingCriteria
  ): ProducerOrderByWithRelationInput | undefined {
    let sortCriteria: ProducerOrderByWithRelationInput | undefined

    if (sortingOption === 'name') {
      sortCriteria = {
        name: sortingCriteria,
      }
    }

    // TODO: Add this when is supported by prisma
    /**
    if (sortingOption === 'posts') {
      sortCriteria = {
        posts: {
          _count: sortingCriteria,
        },
      }
    } */

    return sortCriteria
  }
}
