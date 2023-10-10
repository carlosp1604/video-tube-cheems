import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Translation } from '~/modules/Translations/Domain/Translation'

export abstract class TranslatableModel {
  private _translations: Collection<Translation, Translation['language'] & Translation['field']> =
    Collection.notLoaded()

  get modelTranslations (): Collection<Translation, Translation['language'] & Translation['field']> {
    return this._translations
  }

  set modelTranslations (translations: Collection<Translation, Translation['language'] & Translation['field']>) {
    this._translations = translations
  }

  get translations (): Map<Translation['language'], Translation[]> {
    const translations = new Map<Translation['language'], Translation[]>()

    this._translations.values.forEach((translation) => {
      const languageTranslations = translations.get(translation.language)

      if (languageTranslations) {
        languageTranslations.push(translation)
      } else {
        translations.set(translation.language, [translation])
      }
    })

    return translations
  }
}
