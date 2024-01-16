import { TagApplicationDto } from '~/modules/PostTag/Application/TagApplicationDto'
import { TagPageComponentDto } from '~/modules/PostTag/Infrastructure/TagPageComponentDto'

export class TagPageComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: TagApplicationDto, locale: string): TagPageComponentDto {
    const languageHasTranslations =
      applicationDto.translations.find((translation) => translation.language === locale)

    let nameTranslation = applicationDto.name

    if (languageHasTranslations) {
      const nameFieldTranslation =
          languageHasTranslations.translations.find((translation) => translation.field === 'name')

      if (nameFieldTranslation) {
        nameTranslation = nameFieldTranslation.value
      }
    }

    return {
      id: applicationDto.id,
      name: nameTranslation,
      slug: applicationDto.slug,
    }
  }
}
