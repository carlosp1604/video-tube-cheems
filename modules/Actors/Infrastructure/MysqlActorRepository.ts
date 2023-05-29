import { Prisma } from '@prisma/client'
import { prisma } from '../../../persistence/prisma'
import { RepositoryFilterOption } from '../../Shared/Domain/RepositoryFilterOption'
import { RepositorySortingCriteria, RepositorySortingOptions } from '../../Shared/Domain/RepositorySorting'
import { Actor } from '../Domain/Actor'
import { ActorRepositoryFilterOption, ActorRepositoryInterface } from '../Domain/ActorRepositoryInterface'
import { ActorModelTranslator } from './ActorModelTranslator'

export class MysqlActorRepository implements ActorRepositoryInterface {
  /**
   * Find an Actor given its ID
   * @param actorId Actor ID
   * @return Actor if found or null
   */
  public async findById (actorId: Actor['id']): Promise<Actor | null> {
    const actor = await prisma.actor.findFirst({
      where: {
        id: actorId,
        deletedAt: null,
      },
    })

    if (actor === null) {
      return null
    }

    return ActorModelTranslator.toDomain(actor)
  }

  /**
   * Find Actors based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @return Post if found or null
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filters: RepositoryFilterOption<ActorRepositoryFilterOption>[]
  ): Promise<Actor[]> {
    let whereClause: Prisma.ActorWhereInput | undefined = {
      deletedAt: null,
    }

    const whereFilters = this.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters,
    }

    const actors = await prisma.actor.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
    })

    return actors.map((actor) => ActorModelTranslator.toDomain(actor))
  }

  /**
   * Count Actos based on filters
   * @param filters Actor filters
   * @return Number of actors that accomplish with the filters
   */
  public async countPostsWithFilters (
    filters: RepositoryFilterOption<ActorRepositoryFilterOption>[]
  ): Promise<number> {
    let whereClause: Prisma.ActorWhereInput | undefined = {
      deletedAt: null,
    }

    const whereFilters = this.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters,
    }

    const actorsNumber = await prisma.actor.count({
      where: whereClause,
    })

    return actorsNumber
  }

  private buildFilters (
    filters: RepositoryFilterOption<ActorRepositoryFilterOption>[]
  ): Prisma.PostWhereInput | undefined {
    let whereClause: Prisma.ActorWhereInput | undefined = {}

    for (const filter of filters) {
      if (filter.type === 'actorName') {
        whereClause = {
          ...whereClause,
          name: filter.value,
        }
      }

      if (filter.type === 'actorId') {
        whereClause = {
          ...whereClause,
          id: filter.value,
        }
      }
    }

    return whereClause
  }
}
