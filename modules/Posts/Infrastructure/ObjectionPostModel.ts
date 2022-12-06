import { Model } from 'objection'
import { ObjectionPostMetaModel } from './ObjectionPostMetaModel'
import { ObjectionPostTagModel } from './ObjectionPostTagModel'
import { ObjectionActorModel } from './ObjectionActorModel'

export class ObjectionPostModel extends Model {
  id!: string
  title!: string
  description!: string
  views_count!: number
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null
  published_at!: Date | null
  meta!: ObjectionPostMetaModel[]
  tags!: ObjectionPostTagModel[]
  actors!: ObjectionActorModel[]

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
    },
    tags: {
      relation: Model.ManyToManyRelation,
      modelClass: ObjectionPostTagModel,
      join: {
        from: 'posts.id',
        through: {
          from: 'post_post_tags.post_id',
          to: 'post_post_tags.post_tag_id'
        },
        to: 'post_tags.id',
      }
    },
    actors: {
      relation: Model.ManyToManyRelation,
      modelClass: ObjectionActorModel,
      join: {
        from: 'posts.id',
        through: {
          from: 'post_actors.post_id',
          to: 'post_actors.actor_id'
        },
        to: 'actors.id',
      }
    }
  }
}