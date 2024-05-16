import { TagApplicationDto } from '~/modules/PostTag/Application/TagApplicationDto'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'

export class TagCardComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: TagApplicationDto, locale: string): TagCardComponentDto {
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
      imageUrl: applicationDto.imageUrl,
    }
  }
}
