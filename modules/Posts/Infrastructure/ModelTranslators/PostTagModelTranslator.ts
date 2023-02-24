import { PostTag } from '../../Domain/PostTag'
import { DateTime } from 'luxon'
import { PostTag as PrismaPostTagModel } from '@prisma/client'

export class PostTagModelTranslator {
  public static toDomain(
    prismaPostTagModel: PrismaPostTagModel,
  ) {
    let deletedAt: DateTime | null = null

    if (prismaPostTagModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostTagModel.deletedAt)
    }

    return new PostTag (
      prismaPostTagModel.id,
      prismaPostTagModel.name,
      prismaPostTagModel.description,
      prismaPostTagModel.imageUrl,
      DateTime.fromJSDate(prismaPostTagModel.createdAt),
      DateTime.fromJSDate(prismaPostTagModel.updatedAt),
      deletedAt
    )
  }

  public static toDatabase(postTag: PostTag): PrismaPostTagModel {
    return {
      id: postTag.id,
      imageUrl: postTag.imageUrl,
      name: postTag.name,
      description: postTag.description,
      createdAt: postTag.createdAt.toJSDate(),
      deletedAt: postTag.deletedAt?.toJSDate() ?? null,
      updatedAt: postTag.updatedAt.toJSDate(),
    }
  }
}