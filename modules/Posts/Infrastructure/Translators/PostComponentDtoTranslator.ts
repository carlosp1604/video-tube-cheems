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
      views: postViews,
      comments: commentsNumber,
    }
  }
}
