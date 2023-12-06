import { Post } from '~/modules/Posts/Domain/Post'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { MetaApplicationDtoTranslator } from './MetaApplicationDtoTranslator'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'
import {
  PostWithRelationsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'
import { PostTranslationsDtoTranslator } from '~/modules/Posts/Application/Translators/PostTranslationsDtoTranslator'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'

export class PostWithRelationsDtoTranslator {
  public static fromDomain (post: Post): PostWithRelationsApplicationDto {
    let producer: ProducerApplicationDto | null = null

    if (post.producer !== null) {
      producer = ProducerApplicationDtoTranslator.fromDomain(post.producer)
    }

    let actor: ActorApplicationDto | null = null

    if (post.actor !== null) {
      actor = ActorApplicationDtoTranslator.fromDomain(post.actor)
    }

    const meta = post.meta.map((meta) => {
      return MetaApplicationDtoTranslator.fromDomain(meta)
    })

    const publishedAt = post.publishedAt?.toISO() ?? ''

    return {
      id: post.id,
      createdAt: post.createdAt.toISO(),
      description: post.description,
      meta,
      publishedAt,
      title: post.title,
      producer,
      slug: post.slug,
      translations: PostTranslationsDtoTranslator.fromDomain(post),
      actor,
    }
  }
}
