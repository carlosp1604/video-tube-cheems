import { DateTime } from 'luxon'
import { Translatation as TranslationPrismaModel } from '@prisma/client'
import { Translation } from '~/modules/Translations/Domain/Translation'

export class TranslationModelTranslator {
  public static toDomain (translationPrismaModel: TranslationPrismaModel) {
    return new Translation(
      translationPrismaModel.translatableId,
      translationPrismaModel.translatableType,
      translationPrismaModel.field,
      translationPrismaModel.value,
      translationPrismaModel.language,
      DateTime.fromJSDate(translationPrismaModel.createdAt),
      DateTime.fromJSDate(translationPrismaModel.updatedAt)
    )
  }
}
