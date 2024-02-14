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
import { View } from '~/modules/Views/Domain/View'
import { ViewModelTranslator } from '~/modules/Views/Infrastructure/ViewModelTranslator'

export class MysqlActorRepository implements ActorRepositoryInterface {
  /**
   * Insert an Actor in the persistence layer
   * @param actor Actor to persist
   */
  public async save (actor: Actor): Promise<void> {
    const actorModel = ActorModelTranslator.toDatabase(actor)

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
              views: true,
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
        actorViews: actor._count.views,
      }
    })

    return {
      actors: actorsWithPostsNumber,
      actorsNumber,
    }
  }

  /**
   * Create a new actor view for an actor given its ID
   * @param actorId Actor ID
   * @param view Actor View
   */
  public async createActorView (actorId: Actor['id'], view: View): Promise<void> {
    const prismaPostView = ViewModelTranslator.toDatabase(view)

    await prisma.actor.update({
      where: {
        id: actorId,
      },
      data: {
        views: {
          create: {
            id: prismaPostView.id,
            viewableType: prismaPostView.viewableType,
            userId: prismaPostView.userId,
            createdAt: prismaPostView.createdAt,
          },
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
        views: {
          _count: sortingCriteria,
        },
      }
    }

    return sortCriteria
  }
}
