import { DateTime } from 'luxon'
import { PostComponentProducerDto } from '../../../Producers/Infrastructure/Dtos/PostComponentProducerDto'
import { PostComponentProducerDtoTranslator } from '../../../Producers/Infrastructure/Translators/PostComponentProducerDtoTranslator'
import { PostApplicationDto } from '../../Application/Dtos/PostApplicationDto'
import { PostComponentDto } from '../Dtos/PostComponentDto'
import { ActorComponentDtoTranslator } from './ActorComponentDtoTranslator'
import { TagComponentDtoTranslator } from './TagComponentDtoTranslator'
import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'

export class PostComponentDtoTranslator {
  public static fromApplicationDto(
    applicationDto: PostApplicationDto,
    commentsNumber: number,
    reactionsNumber: number,
    locale: string
  ): PostComponentDto {
    const actors = applicationDto.actors.map((actor) => ActorComponentDtoTranslator.fromApplicationDto(actor))
    const tags = applicationDto.tags.map((tag) => TagComponentDtoTranslator.fromApplicationDto(tag))
    let producer: PostComponentProducerDto | null = null

    if (applicationDto.producer !== null) {
      producer = PostComponentProducerDtoTranslator.fromApplicationDto(applicationDto.producer)
    }

    const video = VideoComponentDtoTranslator.fromApplicationDto(applicationDto)

    const date = DateTime.fromISO(applicationDto.publishedAt).setLocale(locale).toLocaleString(DateTime.DATE_MED)

    return {
      id: applicationDto.id,
      actors,
      video,
      tags,
      producer,
      description: applicationDto.description,
      date,
      reactions: reactionsNumber,
      title: applicationDto.title,
      // TODO: Support views
      views: 0,
      comments: commentsNumber
    }
  }
}