import { Model } from 'objection'
import { ObjectionUserModel } from '../../../Auth/Infrastructure/ObjectionUserModel'

export class ObjectionPostCommentModel extends Model {
  id!: string
  comment!: string
  post_id!: string
  parent_comment_id!: string | null
  user_id!: string
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null
  user!: ObjectionUserModel
  childComments!: ObjectionPostCommentModel[]

  public static get tableName(): string {
    return 'post_comments'
  }

  public static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: ObjectionUserModel,
      join: {
        from: 'post_comments.user_id',
        to: 'users.id'
      }
    },
    childComments: {
      relation: Model.HasManyRelation,
      modelClass: ObjectionPostCommentModel,
      join: {
        from: 'post_comments.id',
        to: 'post_comments.parent_comment_id'
      }
    }
  }
}