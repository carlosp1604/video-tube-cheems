import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import { Post } from '~/modules/Posts/Domain/Post'
import {
  TranslationApplicationDtoTranslator
} from '~/modules/Translations/Application/TranslationApplicationDtoTranslator'

export class PostTranslationsDtoTranslator {
  public static fromDomain (post: Post): ModelTranslationsApplicationDto[] {
    const postTranslations: ModelTranslationsApplicationDto[] = []

    post.translations.forEach((value, key) => {
      const languageTranslations = value.map((translation) => {
        return TranslationApplicationDtoTranslator.fromDomain(translation)
      })

      const postLanguageTranslation: ModelTranslationsApplicationDto = {
        language: key,
        translations: languageTranslations,
      }

      postTranslations.push(postLanguageTranslation)
    })

    return postTranslations
  }
}
