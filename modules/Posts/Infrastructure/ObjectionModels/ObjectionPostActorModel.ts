import { Model } from 'objection'

export class ObjectionPostActorModel extends Model {
  post_id!: string
  actor_id!: string
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null

  public static get tableName(): string {
    return 'post_actors'
  }
}