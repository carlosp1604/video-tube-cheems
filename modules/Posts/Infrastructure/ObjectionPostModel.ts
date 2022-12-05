import { Model } from 'objection'
import { ObjectionPostMetaModel } from './ObjectionPostMetaModel'

export class ObjectionPostModel extends Model {
  id!: string
  title!: string
  description!: string
  views_count!: number
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null
  meta!: ObjectionPostMetaModel[]

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