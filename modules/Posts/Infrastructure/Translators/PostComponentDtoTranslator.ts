import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import {
  PostComponentDto,
  PostComponentDtoActorDto, PostComponentDtoProducerDto,
  PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import {
  VideoDownloadUrlComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/VideoDownloadUrlComponentDtoTranslator'
import {
  VideoEmbedUrlComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/VideoEmbedUrlComponentDtoTranslator'

export class PostComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostApplicationDto, locale: string): PostComponentDto {
    const actors: PostComponentDtoActorDto[] = applicationDto.actors.map((actor) => ({
      name: actor.name,
      id: actor.id,
      imageUrl: actor.imageUrl,
    }))

    const tags: PostComponentDtoTagDto[] = applicationDto.tags.map((tag) => {
      const languageHasTranslations =
        tag.translations.find((translation) => translation.language === locale)

      let nameTranslation = tag.name

      if (languageHasTranslations) {
        const nameFieldTranslation =
          languageHasTranslations.translations.find((translation) => translation.field === 'name')

        if (nameFieldTranslation) {
          nameTranslation = nameFieldTranslation.value
        }
      }

      return {
        name: nameTranslation,
        id: tag.id,
      }
    })

    let producer: PostComponentDtoProducerDto | null = null

    if (applicationDto.producer !== null) {
      producer = {
        name: applicationDto.producer.name,
        id: applicationDto.producer.id,
        imageUrl: applicationDto.producer.imageUrl,
      }
    }

    let actor: PostComponentDtoActorDto | null = null

    if (applicationDto.actor !== null) {
      actor = {
        name: applicationDto.actor.name,
        id: applicationDto.actor.id,
        imageUrl: applicationDto.actor.imageUrl,
      }
    }

    const video = VideoComponentDtoTranslator.fromApplicationDto(applicationDto)

    const date = (new DateService()).formatDateToDateMedFromIso(applicationDto.publishedAt, locale)

    const languageHasTranslations = applicationDto.translations.find((translation) => translation.language === locale)

    let titleTranslation = applicationDto.title
    let descriptionTranslation = applicationDto.description

    if (languageHasTranslations) {
      const titleFieldTranslation =
        languageHasTranslations.translations.find((translation) => translation.field === 'title')
      const descriptionFieldTranslation =
        languageHasTranslations.translations.find((translation) => translation.field === 'description')

      if (titleFieldTranslation) {
        titleTranslation = titleFieldTranslation.value
      }

      if (descriptionFieldTranslation) {
        descriptionTranslation = descriptionFieldTranslation.value
      }
    }

    const downloadUrls = applicationDto.videoUrls.filter((videoUrl) => {
      return videoUrl.type === 'Download'
    }).map((videoUrl) => {
      return VideoDownloadUrlComponentDtoTranslator.fromApplicationDto(videoUrl)
    })

    const embedUrls = applicationDto.videoUrls.filter((videoUrl) => {
      return videoUrl.type === 'Embed'
    }).map((videoUrl) => {
      return VideoEmbedUrlComponentDtoTranslator.fromApplicationDto(videoUrl)
    })

    return {
      id: applicationDto.id,
      actors,
      video,
      tags,
      producer,
      description: descriptionTranslation,
      date,
      title: titleTranslation,
      actor,
      downloadUrls,
      embedUrls,
    }
  }
}
