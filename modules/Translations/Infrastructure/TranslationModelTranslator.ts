import { DateTime } from 'luxon'
import { Translatation as TranslationPrismaModel } from '@prisma/client'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { TranslatableType } from '.prisma/client'

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

  public static toDatabase (translation: Translation): TranslationPrismaModel {
    return {
      translatableId: translation.translatableId,
      field: translation.field,
      value: translation.value,
      createdAt: translation.createdAt.toJSDate(),
      translatableType: translation.translatableType as TranslatableType,
      language: translation.language,
      updatedAt: translation.updatedAt.toJSDate(),
    }
  }
}
