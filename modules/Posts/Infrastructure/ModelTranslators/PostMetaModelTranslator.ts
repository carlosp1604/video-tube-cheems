import { DateTime } from 'luxon'
import { PostMeta as PrismaPostMetaModel } from '@prisma/client'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'

export class PostMetaModelTranslator {
  public static toDomain (prismaPostMetaModel: PrismaPostMetaModel): PostMeta {
    let deletedAt: DateTime | null = null

    if (prismaPostMetaModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostMetaModel.deletedAt)
    }

    return new PostMeta(
      prismaPostMetaModel.type,
      prismaPostMetaModel.value,
      prismaPostMetaModel.postId,
      DateTime.fromJSDate(prismaPostMetaModel.createdAt),
      DateTime.fromJSDate(prismaPostMetaModel.updatedAt),
      deletedAt
    )
  }

  public static toDatabase (postMeta: PostMeta): PrismaPostMetaModel {
    return {
      type: postMeta.type,
      postId: postMeta.postId,
      value: postMeta.value,
      createdAt: postMeta.createdAt.toJSDate(),
      deletedAt: postMeta.deletedAt?.toJSDate() ?? null,
      updatedAt: postMeta.updatedAt.toJSDate(),
    }
  }
}
