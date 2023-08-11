export interface TranslationComponentDto {
  readonly translatableId: string
  readonly field: string
  readonly language: string
  readonly value: string
  readonly createdAt: string
}

export interface ModelTranslationComponentDto {
  readonly language: string
  readonly translations: TranslationComponentDto[]
}
