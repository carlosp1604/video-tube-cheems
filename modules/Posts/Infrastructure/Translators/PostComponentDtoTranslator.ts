import { DateTime } from 'luxon'
import { ActorComponentDtoTranslator } from './ActorComponentDtoTranslator'
import { TagComponentDtoTranslator } from './TagComponentDtoTranslator'
import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'
import {
  PostReactionComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostReactionComponentDtoTranslator'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostComponentProducerDto } from '~/modules/Producers/Infrastructure/Dtos/PostComponentProducerDto'
import {
  PostComponentProducerDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/PostComponentProducerDtoTranslator'

export class PostComponentDtoTranslator {
  public static fromApplicationDto (
    applicationDto: PostApplicationDto,
    commentsNumber: number,
    reactionsNumber: number,
    postViews: number,
    userReaction: PostReactionApplicationDto | null,
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
      views: postViews,
      comments: commentsNumber,
      userReaction: userReaction
        ? PostReactionComponentDtoTranslator.fromApplicationDto(userReaction)
        : null,
    }
  }
}
