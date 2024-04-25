import { ProducerModelTranslator } from './ProducerModelTranslator'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import { prisma } from '~/persistence/prisma'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import {
  ProducersWithPostsCountViewsCountWithTotalCount,
  ProducerWithPostsWithViewsCount
} from '~/modules/Producers/Domain/ProducerWithCountInterface'
import { Prisma } from '@prisma/client'
import ProducerOrderByWithRelationInput = Prisma.ProducerOrderByWithRelationInput
import { ProducerSortingOption } from '~/modules/Producers/Domain/ProducerSorting'

export class MysqlProducerRepository implements ProducerRepositoryInterface {
  /**
   * Insert a Producer in the persistence layer
   * @param producer Producer to persist
   */
  public async save (producer: Producer): Promise<void> {
    const producerModel = ProducerModelTranslator.toDatabase(producer, 0)

    await prisma.producer.create({
      data: {
        slug: producerModel.slug,
        updatedAt: producerModel.updatedAt,
        deletedAt: producerModel.deletedAt,
        createdAt: producerModel.createdAt,
        name: producerModel.name,
        id: producerModel.id,
        description: producerModel.description,
        parentProducerId: producerModel.parentProducerId,
        imageUrl: producerModel.imageUrl,
        brandHexColor: producerModel.brandHexColor,
      },
    })
  }

  /**
   * Count producers number
   * @return number of producers
   */
  public async count (): Promise<number> {
    return prisma.producer.count({
      where: {
        deletedAt: null,
      },
    })
  }

  /**
   * TODO: Pagination for this use-case
   * Get first 20 most popular Producers
   * @param includedProducersSlugs producers Slug to include
   * @return Array of Producer
   */
  public async getPopular (includedProducerSlugs: Array<Producer['slug']>): Promise<Producer[]> {
    const [producersToInclude, popularProducers] = await prisma.$transaction([
      prisma.producer.findMany({
        where: {
          slug: {
            in: includedProducerSlugs,
          },
        },
        take: 20,
      }),
      prisma.producer.findMany({
        take: 20,
        where: {
          slug: {
            not: {
              in: includedProducerSlugs,
            },
          },
        },
        orderBy: {
          viewsCount: 'desc',
        },
      }),
    ])

    return [...producersToInclude, ...popularProducers].map(
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
   * Find a Producer given its ID
   * @param producerId Producer ID
   * @return Producer if found or null
   */
  public async findById (producerId: Producer['id']): Promise<Producer | null> {
    const producer = await prisma.producer.findFirst({
      where: {
        id: producerId,
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
   * @return ProducersWithPostsCountViewsCountWithTotalCount
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ProducerSortingOption,
    sortingCriteria: SortingCriteria
  ): Promise<ProducersWithPostsCountViewsCountWithTotalCount> {
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

    const producersWithPostsNumber: ProducerWithPostsWithViewsCount[] = producers.map((producer) => {
      return {
        producer: ProducerModelTranslator.toDomain(producer),
        postsNumber: producer._count.posts,
        producerViews: Number.parseInt(producer.viewsCount.toString()),
      }
    })

    return {
      producers: producersWithPostsNumber,
      producersNumber,
    }
  }

  /**
   * Add a new producer view for a producer given its ID
   * @param producerId Producer ID
   */
  public async addProducerView (producerId: Producer['id']): Promise<void> {
    await prisma.producer.update({
      where: {
        id: producerId,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    })
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

    if (sortingOption === 'views') {
      sortCriteria = {
        views: {
          _count: sortingCriteria,
        },
      }
    }

    return sortCriteria
  }
}
