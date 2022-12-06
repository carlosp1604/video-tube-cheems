import { Model } from 'objection'

export class ObjectionPostPostTagModel extends Model {
  post_id!: string
  tag_id!: string
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null

  public static get tableName(): string {
    return 'post_post_tags'
  }
}