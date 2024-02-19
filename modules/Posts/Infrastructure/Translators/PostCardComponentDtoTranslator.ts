import { PostAnimationDtoTranslator } from './PostAnimationDtoTranslator'
import {
  ActorPostCardComponentDto,
  PostCardComponentDto,
  ProducerPostCardComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'
import {
  PostWithRelationsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { MetaApplicationDto } from '~/modules/Posts/Application/Dtos/MetaApplicationDto'

export class PostCardComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostWithRelationsApplicationDto,
    postViews: number,
    locale: string
  ): PostCardComponentDto {
    const animation: PostAnimationDto | null = PostAnimationDtoTranslator.fromApplication(applicationDto.meta)

    // FIXME: This should be resolved with the dependencies container
    const dateService = new DateService()
    const date = dateService.formatAgoLike(applicationDto.publishedAt, locale)

    const thumb = PostCardComponentDtoTranslator.getMeta(applicationDto.meta, 'thumb')
    const duration = PostCardComponentDtoTranslator.getMeta(applicationDto.meta, 'duration')
    const externalLink = PostCardComponentDtoTranslator.getMeta(applicationDto.meta, 'external-link')

    let formattedDuration = ''

    if (duration) {
      formattedDuration = dateService.formatSecondsToHHMMSSFormat(parseInt(duration.value))
    }

    let producer: ProducerPostCardComponentDto | null = null

    // TODO: Support producer hierarchy
    if (applicationDto.producer !== null) {
      producer = {
        id: applicationDto.producer.id,
        slug: applicationDto.producer.slug,
        imageUrl: applicationDto.producer.imageUrl,
        name: applicationDto.producer.name,
        brandHexColor: applicationDto.producer.brandHexColor,
      }
    }

    let actor: ActorPostCardComponentDto | null = null

    if (applicationDto.actor !== null) {
      actor = {
        id: applicationDto.actor.id,
        slug: applicationDto.actor.slug,
        imageUrl: applicationDto.actor.imageUrl,
        name: applicationDto.actor.name,
      }
    }

    let titleTranslation = applicationDto.title
    const languageHasTranslations = applicationDto.translations.find((translation) => translation.language === locale)

    if (languageHasTranslations) {
      const fieldTranslation = languageHasTranslations.translations.find((translation) => translation.field === 'title')

      if (fieldTranslation) {
        titleTranslation = fieldTranslation.value
      }
    }

    return {
      id: applicationDto.id,
      animation,
      date,
      producer,
      thumb: thumb ? thumb.value : '',
      title: titleTranslation,
      views: postViews,
      duration: formattedDuration,
      slug: applicationDto.slug,
      actor,
      externalLink: externalLink ? externalLink.value : null,
    }
  }

  private static getMeta (postMeta: MetaApplicationDto[], type: string): MetaApplicationDto | undefined {
    return postMeta.find((meta) => {
      return meta.type === type
    })
  }
}
