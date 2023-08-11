import { TranslationApplicationDto } from '~/modules/Translations/Application/TranslationApplicationDto'

export interface ModelTranslationsApplicationDto {
  readonly language: string
  readonly translations: TranslationApplicationDto[]
}
