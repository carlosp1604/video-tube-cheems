import { DateTime } from 'luxon'
import { PostTag as PrismaPostTagModel } from '@prisma/client'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { PostTagWithTranslations } from '~/modules/Posts/Infrastructure/PrismaModels/PostTagModel'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'

export class PostTagModelTranslator {
  public static toDomain (
    prismaPostTagModel: PrismaPostTagModel
  ) {
    let deletedAt: DateTime | null = null

    if (prismaPostTagModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostTagModel.deletedAt)
    }

    const translationsCollection: Collection<Translation, string> = Collection.initializeCollection()

    const postTagWithTranslations = prismaPostTagModel as PostTagWithTranslations

    postTagWithTranslations.translations.forEach((translation) => {
      const domainTranslation = TranslationModelTranslator.toDomain(translation)

      translationsCollection.addItem(
        domainTranslation, translation.language + translation.field
      )
    })

    return new PostTag(
      prismaPostTagModel.id,
      prismaPostTagModel.slug,
      prismaPostTagModel.name,
      prismaPostTagModel.description,
      prismaPostTagModel.imageUrl,
      DateTime.fromJSDate(prismaPostTagModel.createdAt),
      DateTime.fromJSDate(prismaPostTagModel.updatedAt),
      deletedAt,
      translationsCollection
    )
  }

  public static toDatabase (postTag: PostTag): PrismaPostTagModel {
    return {
      id: postTag.id,
      slug: postTag.slug,
      imageUrl: postTag.imageUrl,
      name: postTag.name,
      description: postTag.description,
      createdAt: postTag.createdAt.toJSDate(),
      deletedAt: postTag.deletedAt?.toJSDate() ?? null,
      updatedAt: postTag.updatedAt.toJSDate(),
    }
  }
}
