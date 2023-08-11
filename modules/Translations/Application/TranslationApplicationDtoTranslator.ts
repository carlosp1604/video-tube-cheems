import { Translation } from '~/modules/Translations/Domain/Translation'
import { TranslationApplicationDto } from '~/modules/Translations/Application/TranslationApplicationDto'

export class TranslationApplicationDtoTranslator {
  public static fromDomain (translation: Translation): TranslationApplicationDto {
    return {
      translatableId: translation.translatableId,
      createdAt: translation.createdAt.toISO(),
      value: translation.value,
      field: translation.field,
      language: translation.language,
    }
  }
}
