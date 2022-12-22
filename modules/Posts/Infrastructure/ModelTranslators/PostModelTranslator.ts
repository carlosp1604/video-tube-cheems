import { ObjectionPostModel } from '../ObjectionModels/ObjectionPostModel'
import { RepositoryOptions } from '../../Domain/PostRepositoryInterface'
import { Post } from '../../Domain/Post'
import { PostMetaModelTranslator } from './PostMetaModelTranslator'
import { PostTagModelTranslator } from './PostTagModelTranslator'
import { ActorModelTranslator } from './ActorModelTranslator'
import { DateTime } from 'luxon'
import { PostCommentModelTranslator } from './PostCommentModelTranslator'
import { PostReactionModelTranslator } from './PostReactionModelTranslator'
import { ModelObject } from 'objection'

type MysqlPostRow = Partial<ModelObject<ObjectionPostModel>>

export class PostModelTranslator {
  public static toDomain(
    objectionPostModel: ObjectionPostModel,
    options: RepositoryOptions[] = []
  ) {
    let publishedAt: DateTime | null = null
    let deletedAt: DateTime | null = null

    if (objectionPostModel.published_at !== null) {
      publishedAt = DateTime.fromJSDate(objectionPostModel.published_at)
    }

    if (objectionPostModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionPostModel.deleted_at)
    }

    const post = new Post(
      objectionPostModel.id,
      objectionPostModel.title,
      objectionPostModel.description,
      objectionPostModel.views_count,
      DateTime.fromJSDate(objectionPostModel.created_at),
      DateTime.fromJSDate(objectionPostModel.updated_at),
      deletedAt,
      publishedAt
    )

    if (options.includes('meta')) {
      for (let i = 0; i < objectionPostModel.meta.length; i++) {
        const postMetaDomain = PostMetaModelTranslator.toDomain(objectionPostModel.meta[i])
        post.addMeta(postMetaDomain)
      }
    }

    if (options.includes('tags')) {
      for (let i = 0; i < objectionPostModel.tags.length; i++) {
        const postTagDomain = PostTagModelTranslator.toDomain(objectionPostModel.tags[i])
        post.addTag(postTagDomain)
      }
    }

    if (options.includes('actors')) {
      for (let i = 0; i < objectionPostModel.actors.length; i++) {
        const actorDomain = ActorModelTranslator.toDomain(objectionPostModel.actors[i])
        post.addActor(actorDomain)
      }
    }

    if (options.includes('comments')) {
      for (let i = 0; i < objectionPostModel.comments.length; i++) {
        const commentDomain = PostCommentModelTranslator.toDomain(objectionPostModel.comments[i], )
        post.createComment(commentDomain)
      }
    }

    if (options.includes('reactions')) {
      for (let i = 0; i < objectionPostModel.reactions.length; i++) {
        const reactionDomain = PostReactionModelTranslator.toDomain(objectionPostModel.reactions[i])
        post.addReaction(reactionDomain)
      }
    }

    return post
  }

  public static toDatabase(post: Post): MysqlPostRow {
    return {
      id: post.id,
      description: post.description,
      title: post.title,
      published_at: post.publishedAt?.toJSDate() ?? null,
      created_at: post.createdAt.toJSDate(),
      deleted_at: post.deletedAt?.toJSDate() ?? null,
      updated_at: post.updatedAt.toJSDate(),
      views_count: post.viewsCount,
    }
  }
}