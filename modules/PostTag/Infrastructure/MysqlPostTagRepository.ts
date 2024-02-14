import { prisma } from '~/persistence/prisma'
import { PostTagRepositoryInterface } from '~/modules/PostTag/Domain/PostTagRepositoryInterface'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import { PostTagModelTranslator } from '~/modules/PostTag/Infrastructure/PostTagModelTranslator'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'

export class MysqlPostTagRepository implements PostTagRepositoryInterface {
  /**
   * Insert a Tag in the persistence layer
   * @param tag Tag to persist
   */
  public async save (tag: PostTag): Promise<void> {
    const tagModel = PostTagModelTranslator.toDatabase(tag)
    const translations = Array.from(tag.translations.values()).flat()
      .map((translation) => { return TranslationModelTranslator.toDatabase(translation) })

    await prisma.postTag.create({
      data: {
        slug: tagModel.slug,
        updatedAt: tagModel.updatedAt,
        deletedAt: tagModel.deletedAt,
        createdAt: tagModel.createdAt,
        name: tagModel.name,
        id: tagModel.id,
        description: tagModel.description,
        imageUrl: tagModel.imageUrl,
        translations: {
          connectOrCreate: translations.map((translation) => {
            return {
              where: {
                translatableId_field_translatableType_language: {
                  language: translation.language,
                  translatableType: translation.translatableType,
                  field: translation.field,
                  translatableId: translation.translatableId,
                },
              },
              create: {
                createdAt: translation.createdAt,
                updatedAt: translation.updatedAt,
                language: translation.language,
                translatableType: translation.translatableType,
                field: translation.field,
                value: translation.value,
              },
            }
          }),
        },
      },
    })
  }

  /**
   * Find a Tag given its slug
   * @param tagSlug Tag Slug
   * @return Tag if found or null
   */
  public async findBySlug (tagSlug: PostTag['slug']): Promise<PostTag | null> {
    const tag = await prisma.postTag.findFirst({
      where: {
        slug: tagSlug,
        deletedAt: null,
      },
      include: {
        translations: true,
      },
    })

    if (tag === null) {
      return null
    }

    return PostTagModelTranslator.toDomain(tag)
  }
}
