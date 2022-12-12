import { Post } from '../../Domain/Post'
import { PostApplicationDto } from '../Dtos/PostApplicationDto'
import { ActorApplicationDtoTranslator } from './ActorApplicationDtoTranslator'
import { CommentApplicationDtoTranslator } from './CommentApplicationDtoTranslator'
import { MetaApplicationDtoTranslator } from './MetaApplicationDtoTranslator'
import { ReactionApplicationDtoTranslator } from './ReactionApplicationDtoTranslator'
import { TagApplicationDtoTranslator } from './TagApplicationDtoTranslator'

export class PostApplicationDtoTranslator {
  public static fromDomain(post: Post): PostApplicationDto {
    return {
      id: post.id,
      actors: post.actors.map((actor) => {
        return ActorApplicationDtoTranslator.fromDomain(actor)
      }),
      viewsCount: post.viewsCount,
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
      title: post.title
    }
  }
}