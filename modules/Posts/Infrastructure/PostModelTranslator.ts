import { ObjectionPostModel } from './ObjectionPostModel'
import { RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { Post } from '../Domain/Post'
import { PostMetaModelTranslator } from './PostMetaModelTranslator'
import { PostTagModelTranslator } from './PostTagModelTranslator'
import { ActorModelTranslator } from './ActorModelTranslator'

export class PostModelTranslator {
  public static toDomain(
    objectionPostModel: ObjectionPostModel,
    options: RepositoryOptions[] = []
  ) {
    const post = new Post(
      objectionPostModel.id,
      objectionPostModel.title,
      objectionPostModel.description,
      objectionPostModel.views_count,
      objectionPostModel.created_at,
      objectionPostModel.updated_at,
      objectionPostModel.deleted_at
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

    return post
  }
}