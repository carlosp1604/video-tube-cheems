import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'

export interface TagApplicationDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly translations: ModelTranslationsApplicationDto[]
  readonly createdAt: string
}
