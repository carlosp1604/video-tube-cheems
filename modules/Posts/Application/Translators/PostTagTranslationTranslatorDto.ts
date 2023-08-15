import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import {
  TranslationApplicationDtoTranslator
} from '~/modules/Translations/Application/TranslationApplicationDtoTranslator'
import { PostTag } from '~/modules/Posts/Domain/PostTag'

export class PostTagTranslationTranslatorDto {
  public static fromDomain (postTag: PostTag): ModelTranslationsApplicationDto[] {
    const postTranslations: ModelTranslationsApplicationDto[] = []

    postTag.translations.forEach((value, key) => {
      const languageTranslations = value.map((translation) => {
        return TranslationApplicationDtoTranslator.fromDomain(translation)
      })

      const postTagLanguageTranslation: ModelTranslationsApplicationDto = {
        language: key,
        translations: languageTranslations,
      }

      postTranslations.push(postTagLanguageTranslation)
    })

    return postTranslations
  }
}
