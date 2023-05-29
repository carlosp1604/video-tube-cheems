import { CommentApplicationDtoTranslator } from './CommentApplicationDtoTranslator'
import { MetaApplicationDtoTranslator } from './MetaApplicationDtoTranslator'
import { ReactionApplicationDtoTranslator } from './ReactionApplicationDtoTranslator'
import { TagApplicationDtoTranslator } from './TagApplicationDtoTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'

export class PostApplicationDtoTranslator {
  public static fromDomain (post: Post): PostApplicationDto {
    return {
      id: post.id,
      createdAt: post.createdAt.toISO(),
      actors: post.actors.map((actor) => {
        return ActorApplicationDtoTranslator.fromDomain(actor)
      }),
      comments: post.comments.map((comment) => {
        return CommentApplicationDtoTranslator.fromDomain(comment)
      }),
      description: post.description,
      meta: post.meta.map((meta) => {
        return MetaApplicationDtoTranslator.fromDomain(meta)
      }),
      publishedAt: post.publishedAt?.toISO() ?? '',
      reactions: post.reactions.map((reaction) => {
        return ReactionApplicationDtoTranslator.fromDomain(reaction)
      }),
      tags: post.tags.map((tag) => {
        return TagApplicationDtoTranslator.fromDomain(tag)
      }),
      title: post.title,
      producer: post.producer !== null
        ? ProducerApplicationDtoTranslator.fromDomain(post.producer)
        : null,
    }
  }
}
