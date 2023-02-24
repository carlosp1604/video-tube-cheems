import { DateTime } from 'luxon'
import { PostComponentProducerDto } from '../../../Producers/Infrastructure/Dtos/PostComponentProducerDto'
import { PostComponentProducerDtoTranslator } from '../../../Producers/Infrastructure/Translators/PostComponentProducerDtoTranslator'
import { PostApplicationDto } from '../../Application/Dtos/PostApplicationDto'
import { PostComponentDto } from '../Dtos/PostComponentDto'
import { ActorComponentDtoTranslator } from './ActorComponentDtoTranslator'
import { TagComponentDtoTranslator } from './TagComponentDtoTranslator'
import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'

export class PostComponentDtoTranslator {
  public static fromApplicationDto(applicationDto: PostApplicationDto): PostComponentDto {
    const actors = applicationDto.actors.map((actor) => ActorComponentDtoTranslator.fromApplicationDto(actor))
    const tags = applicationDto.tags.map((tag) => TagComponentDtoTranslator.fromApplicationDto(tag))
    let producer: PostComponentProducerDto | null = null

    if (applicationDto.producer !== null) {
      producer = PostComponentProducerDtoTranslator.fromApplicationDto(applicationDto.producer)
    }

    const video = VideoComponentDtoTranslator.fromApplicationDto(applicationDto)

    const date = DateTime.fromISO(applicationDto.publishedAt).toLocaleString(DateTime.DATE_FULL)

    return {
      actors,
      video,
      tags,
      producer,
      description: applicationDto.description,
      date,
      reactions: applicationDto.reactions.length,
      title: applicationDto.title,
      // TODO: Support views
      views: 0,
    }
  }
}