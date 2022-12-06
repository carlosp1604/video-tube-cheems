import { PostRepositoryInterface, RepositoryFilter, RepositoryOrderCriteria } from '../Domain/PostRepositoryInterface'
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
   * @return Post if found or null
   */
  public async findById(postId: Post['id']): Promise<Post | null> {
    // TODO: Find a solution for this
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)

    const posts = await ObjectionPostModel.query()
      .where('posts.id', '=', postId)
      .withGraphFetched('meta')
      .withGraphFetched('tags')
      .withGraphFetched('actors')

    if (posts.length === 0) {
      return null
    }

    return PostModelTranslator.toDomain(posts[0], ['meta', 'tags', 'actors'])
  }

  /**
   * Find Posts based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param order Post sorting criteria
   * @param filter Post filter
   * @return Post if found or null
   */
  public async findWithOffsetAndLimit(
    offset: number,
    limit: number,
    order: RepositoryOrderCriteria = 'date_desc',
    filter?: RepositoryFilter
  ): Promise<Post[]> {
    // TODO: Find a solution for this
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)

    const posts = await ObjectionPostModel.query()
      .withGraphFetched('meta')
      .withGraphFetched('actors')
      .limit(limit)
      .offset(offset)
      .whereNotNull('published_at')
      .andWhere((builder) => {
        if (order === 'date_desc') {
          builder.orderBy('published_at', 'desc')
        }

        if (order === 'date_asc') {
          builder.orderBy('published_at', 'asc')
        }

        if (order === 'views_asc') {
          builder.orderBy('views_count', 'asc')
        }

        if (order === 'views_desc') {
          builder.orderBy('views_count', 'desc')
        }

        if (filter) {
          // NOTE: At the moment we only support filter by post title
          builder.where('title', 'like', `%${filter.value}%`)
        }
      })

      return posts.map((post) =>
        PostModelTranslator.toDomain(post, ['meta', 'actors']))

  }
}