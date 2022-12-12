import { Model } from 'objection'

export class ObjectionPostReactionModel extends Model {
  post_id!: string
  user_id!: string
  reaction_type!: string
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null

  public static get tableName(): string {
    return 'post_reactions'
  }
}