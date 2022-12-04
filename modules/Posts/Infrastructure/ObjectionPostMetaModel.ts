import { Model } from 'objection'

export class ObjectionPostMetaModel extends Model {
  public static get tableName(): string {
    return 'posts_meta'
  }
}