import { Model } from 'objection'

export class ObjectionPostTagModel extends Model {
  id!: string
  name!: string
  description!: string | null
  image_url!: string | null
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null

  public static get tableName(): string {
    return 'post_tags'
  }
}