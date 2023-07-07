import { PostAnimationDtoTranslator } from './PostAnimationDtoTranslator'
import {
  PostCardComponentDto,
  ProducerPostCardComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'
import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostCardComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostWithProducerAndMetaApplicationDto,
    reactionsNumber: number,
    commentsNumber: number,
    postViews: number,
    locale: string
  ): PostCardComponentDto {
    const animation: PostAnimationDto | null = PostAnimationDtoTranslator.fromApplication(applicationDto.meta)

    // FIXME: This should be resolved with the dependencies container
    const dateService = new DateService()
    const date = dateService
      .formatAgoLike(new Date(applicationDto.publishedAt), locale)

    const thumb = applicationDto.meta.find((meta) => {
      return meta.type === 'thumb'
    })

    const duration = applicationDto.meta.find((meta) => {
      return meta.type === 'duration'
    })

    let formattedDuration = ''

    if (duration) {
      formattedDuration = dateService.formatSecondsToHHMMSSFormat(parseInt(duration.value))
    }

    let producer: ProducerPostCardComponentDto | null = null

    // TODO: Support producer hierarchy
    if (applicationDto.producer !== null) {
      producer = {
        id: applicationDto.producer.id,
        imageUrl: applicationDto.producer.imageUrl,
        name: applicationDto.producer.name,
      }
    }

    return {
      id: applicationDto.id,
      animation,
      date,
      producer,
      thumb: thumb ? thumb.value : '',
      title: applicationDto.title,
      views: postViews,
      duration: formattedDuration,
      slug: applicationDto.slug,
    }
  }
}
