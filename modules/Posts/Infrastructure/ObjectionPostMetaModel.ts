import { Model } from 'objection'

export class ObjectionPostMetaModel extends Model {
  type!: string
  value!: string
  post_id!: string
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null

  public static get tableName(): string {
    return 'posts_meta'
  }
}