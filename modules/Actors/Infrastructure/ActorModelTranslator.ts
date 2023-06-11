import { Actor as PrismaActorModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { Actor } from '~/modules/Actors/Domain/Actor'

export class ActorModelTranslator {
  public static toDomain (prismaActorModel: PrismaActorModel) {
    let deletedAt: DateTime | null = null

    if (prismaActorModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaActorModel.deletedAt)
    }

    return new Actor(
      prismaActorModel.id,
      prismaActorModel.name,
      prismaActorModel.description,
      prismaActorModel.imageUrl,
      DateTime.fromJSDate(prismaActorModel.createdAt),
      DateTime.fromJSDate(prismaActorModel.updatedAt),
      deletedAt
    )
  }
}
