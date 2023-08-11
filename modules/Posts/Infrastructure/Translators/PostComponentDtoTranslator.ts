import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import {
  PostComponentDto,
  PostComponentDtoActorDto, PostComponentDtoProducerDto,
  PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostComponentDtoTranslator {
  public static fromApplicationDto (
    applicationDto: PostApplicationDto,
    commentsNumber: number,
    reactionsNumber: number,
    postViews: number,
    locale: string
  ): PostComponentDto {
    const actors: PostComponentDtoActorDto[] = applicationDto.actors.map((actor) => ({
      name: actor.name,
      id: actor.id,
      imageUrl: actor.imageUrl,
    }))

    const tags: PostComponentDtoTagDto[] = applicationDto.tags.map((tag) => ({
      name: tag.name,
      id: tag.id,
    }))

    let producer: PostComponentDtoProducerDto | null = null

    if (applicationDto.producer !== null) {
      producer = {
        name: applicationDto.producer.name,
        id: applicationDto.producer.id,
        imageUrl: applicationDto.producer.imageUrl,
      }
    }

    const video = VideoComponentDtoTranslator.fromApplicationDto(applicationDto)

    const date = (new DateService()).formatDateToDateMedFromIso(applicationDto.publishedAt, locale)

    const languageHasTranslations = applicationDto.translations.find((translation) => translation.language === locale)

    let titleTranslation = applicationDto.title
    let descriptionTranslation = applicationDto.description

    if (languageHasTranslations) {
      const titleFieldTranslation = languageHasTranslations.translations.find((translation) => translation.field === 'title')
      const descriptionFieldTranslation = languageHasTranslations.translations.find((translation) => translation.field === 'description')

      if (titleFieldTranslation) {
        titleTranslation = titleFieldTranslation.value
      }

      if (descriptionFieldTranslation) {
        descriptionTranslation = descriptionFieldTranslation.value
      }
    }

    return {
      id: applicationDto.id,
      actors,
      video,
      tags,
      producer,
      description: descriptionTranslation,
      date,
      reactions: reactionsNumber,
      title: titleTranslation,
      views: postViews,
      comments: commentsNumber,
    }
  }
}
