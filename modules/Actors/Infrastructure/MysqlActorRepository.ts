import { Prisma } from '@prisma/client'
import { ActorModelTranslator } from './ActorModelTranslator'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { prisma } from '~/persistence/prisma'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ActorsWithPostsCountWithTotalCount, ActorWithPostsCount } from '~/modules/Actors/Domain/ActorWithCountInterface'
import ActorOrderByWithRelationInput = Prisma.ActorOrderByWithRelationInput
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'

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
   * Find an Actor given its slug
   * @param actorSlug Actor Slug
   * @return Actor if found or null
   */
  public async findBySlug (actorSlug: Actor['slug']): Promise<Actor | null> {
    const actor = await prisma.actor.findFirst({
      where: {
        slug: actorSlug,
        deletedAt: null,
      },
    })

    if (actor === null) {
      return null
    }

    return ActorModelTranslator.toDomain(actor)
  }

  /**
   * Find Actors based on sorting criteria
   * @param offset Actor offset
   * @param limit
   * @param sortingOption Actor sorting option
   * @param sortingCriteria Sorting criteria
   * @return ActorsWithPostsCountWithTotalCount
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria
  ): Promise<ActorsWithPostsCountWithTotalCount> {
    const whereClause: Prisma.ActorWhereInput | undefined = {
      deletedAt: null,
    }

    const actorsSortCriteria = MysqlActorRepository.buildOrder(sortingOption, sortingCriteria)

    const [actors, actorsNumber] = await prisma.$transaction([
      prisma.actor.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: actorsSortCriteria,
      }),
      prisma.actor.count({
        where: whereClause,
      }),
    ])

    const actorsWithPostsNumber: ActorWithPostsCount[] = actors.map((actor) => {
      return {
        actor: ActorModelTranslator.toDomain(actor),
        postsNumber: actor._count.posts,
      }
    })

    return {
      actors: actorsWithPostsNumber,
      actorsNumber,
    }
  }

  private static buildOrder (
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria
  ): ActorOrderByWithRelationInput | undefined {
    let sortCriteria: ActorOrderByWithRelationInput | undefined

    if (sortingOption === 'name') {
      sortCriteria = {
        name: sortingCriteria,
      }
    }

    if (sortingOption === 'posts') {
      sortCriteria = {
        posts: {
          _count: sortingCriteria,
        },
      }
    }

    return sortCriteria
  }
}
