import {ObjectionPostModel} from "./ObjectionPostModel";
import {RepositoryOptions} from "../Domain/PostRepositoryInterface";
import {Post} from "../Domain/Post";
import {PostMetaModelTranslator} from "./PostMetaModelTranslator";

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

    if (options.includes('postMeta')) {
      for (let i = 0; i < objectionPostModel.meta.length; i++) {
        const postMetaDomain = PostMetaModelTranslator.toDomain(objectionPostModel.meta[i])
        post.addMeta(postMetaDomain)
      }
    }

    return post
  }
}