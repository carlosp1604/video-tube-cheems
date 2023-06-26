import { DateTime } from 'luxon'
import { PostAnimationDtoTranslator } from './PostAnimationDtoTranslator'
import {
  PostCardComponentDto,
  ProducerPostCardComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'

export class PostCardComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostWithProducerAndMetaApplicationDto,
    reactionsNumber: number,
    commentsNumber: number,
    postViews: number,
    locale: string
  ): PostCardComponentDto {
    const animation: PostAnimationDto | null = PostAnimationDtoTranslator.fromApplication(applicationDto.meta)

    const date = new DateService()
      .formatAgoLike(DateTime.fromISO(applicationDto.publishedAt), locale)

    const thumb = applicationDto.meta.find((meta) => {
      return meta.type === 'thumb'
    })

    const duration = applicationDto.meta.find((meta) => {
      return meta.type === 'duration'
    })

    let formattedDuration = ''

    if (duration) {
      formattedDuration = this.toHoursAndMinutes(parseInt(duration.value))
    }

    let producer: ProducerPostCardComponentDto | null = null

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
    }
  }

  private static toHoursAndMinutes (totalSeconds: number): string {
    const totalMinutes = Math.floor(totalSeconds / 60)

    const seconds = totalSeconds % 60
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    const addZeroPadding = (value: number): string => {
      if (value < 9) {
        return `0${value}`
      }

      return `${value}`
    }

    const formattedHours = hours === 0 ? '' : `${addZeroPadding(hours)}:`
    const formattedMinutes = addZeroPadding(minutes)
    const formattedSeconds = addZeroPadding(seconds)

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`
  }
}
