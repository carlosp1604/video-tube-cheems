import { MetaApplicationDtoTranslator } from './MetaApplicationDtoTranslator'
import { TagApplicationDtoTranslator } from './TagApplicationDtoTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'
import { PostTranslationsDtoTranslator } from '~/modules/Posts/Application/Translators/PostTranslationsDtoTranslator'
import {
  VideoUrlApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/VideoUrlApplicationDtoTranslator'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class PostApplicationDtoTranslator {
  public static fromDomain (post: Post): PostApplicationDto {
    return {
      id: post.id,
      createdAt: post.createdAt.toISO(),
      actors: post.actors.map((actor) => {
        return ActorApplicationDtoTranslator.fromDomain(actor)
      }),
      description: post.description,
      meta: post.meta.map((meta) => {
        return MetaApplicationDtoTranslator.fromDomain(meta)
      }),
      publishedAt: post.publishedAt?.toISO() ?? '',
      tags: post.tags.map((tag) => {
        return TagApplicationDtoTranslator.fromDomain(tag)
      }),
      title: post.title,
      producer: post.producer !== null
        ? ProducerApplicationDtoTranslator.fromDomain(post.producer)
        : null,
      slug: post.slug,
      translations: PostTranslationsDtoTranslator.fromDomain(post),
      actor: post.actor !== null
        ? ActorApplicationDtoTranslator.fromDomain(post.actor)
        : null,
      videoUrls: post.videoUrls.map((videoUrl) => {
        return VideoUrlApplicationDtoTranslator.fromDomain(videoUrl)
      }),
    }
  }
}
