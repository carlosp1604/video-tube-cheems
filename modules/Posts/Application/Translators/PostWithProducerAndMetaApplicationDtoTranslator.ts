import { Post } from '~/modules/Posts/Domain/Post'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { MetaApplicationDtoTranslator } from './MetaApplicationDtoTranslator'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'
import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'

export class PostWithProducerAndMetaApplicationDtoTranslator {
  public static fromDomain (post: Post): PostWithProducerAndMetaApplicationDto {
    let producer: ProducerApplicationDto | null = null

    if (post.producer !== null) {
      producer = ProducerApplicationDtoTranslator.fromDomain(post.producer)
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
    }
  }
}
