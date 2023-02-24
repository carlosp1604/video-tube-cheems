import { Model } from 'objection'

export class ObjectionUserModel extends Model {
  id!: string
  name!: string
  email!: string
  image_url!: string | null
  language!: string
  password!: string
  created_at!: Date
  updated_at!: Date
  deleted_at!: Date | null
  email_verified!: Date | null

  public static get tableName(): string {
    return 'users'
  }
}