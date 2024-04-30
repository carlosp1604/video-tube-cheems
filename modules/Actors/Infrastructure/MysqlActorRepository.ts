import { Prisma } from '@prisma/client'
import { ActorModelTranslator } from './ActorModelTranslator'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { prisma } from '~/persistence/prisma'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import {
  ActorsWithPostsCountViewsCountWithTotalCount,
  ActorWithPostsWithViewsCount
} from '~/modules/Actors/Domain/ActorWithCountInterface'
import ActorOrderByWithRelationInput = Prisma.ActorOrderByWithRelationInput
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'

export class MysqlActorRepository implements ActorRepositoryInterface {
  /**
   * Insert an Actor in the persistence layer
   * @param actor Actor to persist
   */
  public async save (actor: Actor): Promise<void> {
    const actorModel = ActorModelTranslator.toDatabase(actor, 0)

    await prisma.actor.create({
      data: {
        slug: actorModel.slug,
        updatedAt: actorModel.updatedAt,
        deletedAt: actorModel.deletedAt,
        createdAt: actorModel.createdAt,
        name: actorModel.name,
        id: actorModel.id,
        description: actorModel.description,
        imageUrl: actorModel.imageUrl,
      },
    })
  }

  /**
   * Count actors number
   * @return number of actors
   */
  public async count (): Promise<number> {
    return prisma.actor.count({
      where: {
        deletedAt: null,
      },
    })
  }

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
   * @param offset Records offset
   * @param limit Records limit
   * @param sortingOption Sorting option
   * @param sortingCriteria Sorting criteria
   * @return ActorsWithPostsCountViewsCountWithTotalCount
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria
  ): Promise<ActorsWithPostsCountViewsCountWithTotalCount> {
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
              postActors: {
                where: {
                  post: {
                    publishedAt: {
                      not: null,
                      lte: new Date(),
                    },
                  },
                },
              },
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

    const actorsWithPostsNumber: ActorWithPostsWithViewsCount[] = actors.map((actor) => {
      return {
        actor: ActorModelTranslator.toDomain(actor),
        postsNumber: actor._count.postActors,
        actorViews: Number.parseInt(actor.viewsCount.toString()),
      }
    })

    return {
      actors: actorsWithPostsNumber,
      actorsNumber,
    }
  }

  /**
   * Add a new actor view for an actor given its ID
   * @param actorId Actor ID
   */
  public async addActorView (actorId: Actor['id']): Promise<void> {
    await prisma.actor.update({
      where: {
        id: actorId,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    })
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

    // TODO: Add this when is supported by prisma
    /**
    if (sortingOption === 'posts') {
      sortCriteria = {
        postActors: {
          _count: sortingCriteria,
        },
      }
    } */

    if (sortingOption === 'views') {
      sortCriteria = {
        viewsCount: sortingCriteria,
      }
    }

    return sortCriteria
  }
}
