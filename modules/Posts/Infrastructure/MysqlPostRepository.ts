import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { Post } from '../Domain/Post'
import knex from 'knex'
import { Model } from 'objection'
import * as knexConfig from '../../../knexfile'
import { PostModelTranslator } from './PostModelTranslator'
import { ObjectionPostModel } from './ObjectionPostModel'

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save(post: Post): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Options with the relationships to load
   * @return Post if found or null
   */
  public async findById(postId: Post['id'], options: RepositoryOptions[] = []): Promise<Post | null> {
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)
    const posts = await ObjectionPostModel.query()
      .where('id', '=', postId)
      .withGraphFetched('meta')

    if (posts.length === 0) {
      return null
    }

    return PostModelTranslator.toDomain(posts[0], options)
  }
}