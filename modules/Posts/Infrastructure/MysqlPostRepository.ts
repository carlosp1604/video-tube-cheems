import {
  PostRepositoryInterface,
  RepositoryFilter,
  RepositoryOptions, RepositorySortingCriteria, RepositorySortingOptions
} from '../Domain/PostRepositoryInterface'
import { Post } from '../Domain/Post'
import knex from 'knex'
import { Model, OrderByDirection } from 'objection'
import * as knexConfig from '../../../knexfile'
import { PostModelTranslator } from './ModelTranslators/PostModelTranslator'
import { ObjectionPostModel } from './ObjectionModels/ObjectionPostModel'
import { Actor } from '../Domain/Actor'
import { PostTag } from '../Domain/PostTag'
import { PostMeta } from '../Domain/PostMeta'
import { PostComment } from '../Domain/PostComment'
import { PostReaction } from '../Domain/PostReaction'
import { ObjectionPostReactionModel } from './ObjectionModels/ObjectionPostReactionModel'
import { PostReactionModelTranslator } from './ModelTranslators/PostReactionModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { ObjectionPostCommentModel } from './ObjectionModels/ObjectionPostCommentModel'

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save(post: Post): Promise<void> {
    // TODO: Find a solution for this
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)
    try {
      await ObjectionPostModel.transaction(async (transaction) => {
        const mysqlPostRow = PostModelTranslator.toDatabase(post)
        const newPost = await ObjectionPostModel
          .query(transaction)
          .insert(mysqlPostRow)

        // insert post_actors
        await Promise.all(
          post.actors.map((actor: Actor) => {
            return newPost
              .$relatedQuery('postActors', transaction)
              .insert({ actor_id: actor.id })
          })
        )

        // insert post_post_tags
        await Promise.all(
          post.tags.map(async (tag: PostTag) => {
            return newPost
            .$relatedQuery('postTags', transaction)
            .insert({ tag_id: tag.id })
          })
        )

        // insert post_meta
        await Promise.all(
          post.meta.map(async (meta: PostMeta) => {
            return newPost
              .$relatedQuery('meta', transaction)
              .insert({
                value: meta.value,
                type: meta.type
              })
          })
        )

        return newPost
      })
    } 
    catch (exception: unknown) {
      console.log(exception)
    }
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  public async findById(postId: Post['id'], options: RepositoryOptions[] = []): Promise<Post | null> {
    // TODO: Find a solution for this
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)

    const post = await ObjectionPostModel.query()
      .findById(postId)
      .modify((queryBuilder) => {
        queryBuilder.whereNull('deleted_at')
        queryBuilder.andWhere('posts.id', '=', postId)

        options.forEach((option) => {
          if (option === 'comments') {
            const expression = '.[user, childComments'
            const nestedExpression = `comments(filterChildren).[childComments${expression.repeat(10)}${']'.repeat(11)}`
            queryBuilder.withGraphFetched(nestedExpression)
              .modifiers({
                filterChildren(builder) {
                  builder.whereNull('parent_comment_id')
                }
              })

            return
          }
          queryBuilder.withGraphFetched(option)
        })
      })

    if (!post) {
      return null
    }

    return PostModelTranslator.toDomain(post, options)
  }

  /**
   * Find Posts based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filter Post filter
   * @return Post if found or null
   */
  public async findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filter?: RepositoryFilter,
  ): Promise<Post[]> {
    // TODO: Find a solution for this
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)

    const posts = await ObjectionPostModel.query()
      .modify((builder) => {
        builder.whereNotNull('published_at')
        builder.whereNull('deleted_at')
        builder.limit(limit)
        builder.offset(offset)
        builder.withGraphFetched('meta')
        builder.withGraphFetched('actors')
        builder.withGraphFetched('reactions')

        let order: OrderByDirection = 'desc'

        if (sortingCriteria === 'asc') {
          order = 'asc'
        }

        if (sortingOption === 'date') {
          builder.orderBy('published_at', order)
        }

        if (sortingOption === 'views') {
          builder.orderBy('views_count', order)
        }

        if (filter) {
          // NOTE: At the moment we only support filter by post title
          builder.where('title', 'like', `%${filter.value}%`)
        }
      })

      return posts.map((post) =>
        PostModelTranslator.toDomain(post, ['meta', 'actors', 'reactions']))
  }

  /**
   * Add a new Post Reaction
   * @param reaction PostReaction
   */
  public async createReaction(reaction: PostReaction): Promise<void> {
    const mysqlReactionRow = PostReactionModelTranslator.toDatabase(reaction)

    await ObjectionPostReactionModel.query()
      .insert(mysqlReactionRow)
  }

  /**
   * Update a new Post Reaction
   * @param reaction PostReaction
   */
  public async updateReaction(reaction: PostReaction): Promise<void> {
    await ObjectionPostReactionModel.query()
      .patch({
        reaction_type: reaction.reactionType
      })
      .where('user_id', '=', reaction.userId)
  }

  /**
   * Delete a new Post Reaction
   * @param reaction PostReaction
   */
  public async deleteReaction(reaction: PostReaction): Promise<void> {
    await ObjectionPostReactionModel.query()
      .delete()
      .where('user_id', '=', reaction.userId)
  }

  /**
   * Add a new Post Comment
   * @param comment PostComment
   */
  public async createComment(comment: PostComment): Promise<void> {
    const mysqlCommentRow = PostCommentModelTranslator.toDatabase(comment)

    await ObjectionPostCommentModel.query()
      .insert(mysqlCommentRow)
  }

  /**
   * Update a Post Comment
   * @param commentId Post Comment ID
   * @param comment Post Comment comment
   */
  public async updateComment(
    commentId: PostComment['id'],
    comment: PostComment['comment']
  ): Promise<void> {
    await ObjectionPostCommentModel.query()
      .patch({
        comment: comment
      })
      .where('id', '=', commentId)
  }

  /**
   * Delete a Post Comment
   * @param commentId Post Comment ID
   */
  public async deleteComment(commentId: PostComment['id']): Promise<void> {
    await ObjectionPostCommentModel.query()
      .delete()
      .where('id', '=', commentId)
  }
}