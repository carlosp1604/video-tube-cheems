import { Model } from 'objection'
import {ObjectionPostMetaModel} from "./ObjectionPostMetaModel";

export class ObjectionPostModel extends Model {
  public static get tableName(): string {
    return 'posts'
  }

  public static relationMappings = {
    meta: {
      relation: Model.HasManyRelation,
      modelClass: ObjectionPostMetaModel,
      join: {
        from: 'posts.id',
        to: 'posts_meta.post_id'
      }
    }
  }
}