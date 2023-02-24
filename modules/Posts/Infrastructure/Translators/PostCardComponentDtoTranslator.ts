import { DateTime } from 'luxon'
import { DateService } from '../../../../helpers/Infrastructure/DateService'
import { PostApplicationDto } from '../../Application/Dtos/PostApplicationDto'
import { PostAnimationDto } from '../Dtos/PostAnimationDto'
import { PostCardComponentDto, ProducerPostCardComponentDto } from '../Dtos/PostCardComponentDto'
import { PostAnimationDtoTranslator } from './PostAnimationDtoTranslator'

export class PostCardComponentDtoTranslator {
  public static fromApplication(
    applicationDto: PostApplicationDto,
    reactionsNumber: number  
  ): PostCardComponentDto {
    const animation: PostAnimationDto | null = PostAnimationDtoTranslator.fromApplication(applicationDto)

    const date = new DateService().formatAgoLike(DateTime.fromISO(applicationDto.publishedAt))

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
      reactions: reactionsNumber,
      thumb: thumb ? thumb.value : '',
      title: applicationDto.title,
      // TODO: Support views
      views: 0,
      duration : formattedDuration
    }
  }

  private static toHoursAndMinutes(totalSeconds: number): string {
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

    let formattedHours = hours === 0 ? '' : `${addZeroPadding(hours)}:`
    let formattedMinutes = addZeroPadding(minutes)
    let formattedSeconds = addZeroPadding(seconds)
  
    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`
  }
}