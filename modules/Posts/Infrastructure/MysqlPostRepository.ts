import { PostRepositoryFilterOption, PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { Post } from '../Domain/Post'
import { PostModelTranslator } from './ModelTranslators/PostModelTranslator'
import { PostComment } from '../Domain/PostComment'
import { PostReaction } from '../Domain/PostReaction'
import { ObjectionPostReactionModel } from './ObjectionModels/ObjectionPostReactionModel'
import { PostReactionModelTranslator } from './ModelTranslators/PostReactionModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { ObjectionPostCommentModel } from './ObjectionModels/ObjectionPostCommentModel'
import { prisma } from '../../../persistence/prisma'
import { DateTime } from 'luxon'
import { PostMetaModelTranslator } from './ModelTranslators/PostMetaModelTranslator'
import { Prisma } from '@prisma/client'
import { PostWithCountInterface } from '../Domain/PostWithCountInterface'
import { RepositorySortingCriteria, RepositorySortingOptions } from '../../Shared/Domain/RepositorySorting'
import { RepositoryFilter } from '../../Shared/Domain/RepositoryFilter'

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save(post: Post): Promise<void> {
    const prismaPostModel = PostModelTranslator.toDatabase(post)
    const comments = post.comments.map((comment) => PostCommentModelTranslator.toDatabase(comment))
    const meta = post.meta.map((meta) => PostMetaModelTranslator.toDatabase(meta))
    const reactions = post.reactions.map((reaction) => PostReactionModelTranslator.toDatabase(reaction))
    
    await prisma.post.create({
      data: {
        ...prismaPostModel,
        comments: {
          connectOrCreate: comments.map((comment) => {
            return {
              where: {
               id: comment.id
              },
              create: {
                ...comment
              }
            }
          })
        },
        tags: {
          connectOrCreate: post.tags.map((tag) => {
            return {
              where: {
               postId_postTagId: {
                postId: post.id,
                postTagId: tag.id,
               },
              },
              create: {
                createdAt: DateTime.now().toJSDate(),
                updatedAt: DateTime.now().toJSDate(),
                postTagId: tag.id,
              }
            }
          })
        },
        actors: {
          connectOrCreate: post.actors.map((actor) => {
            return {
              where: {
               postId_actorId: {
                postId: post.id,
                actorId: actor.id,
               },
              },
              create: {
                createdAt: DateTime.now().toJSDate(),
                updatedAt: DateTime.now().toJSDate(),
                actorId: actor.id,
              }
            }
          })
        },
        meta: {
          connectOrCreate: meta.map((meta) => {
            return {
              where: {
               type_postId: {
                postId: post.id,
                type: meta.type
               }
              },
              create: {
                ...meta
              }
            }
          })
        },
        reactions: {
          connectOrCreate: reactions.map((reaction) => {
            return {
              where: {
               postId_userId: {
                postId: post.id,
                userId: reaction.userId
               }
              },
              create: {
                ...reaction
              }
            }
          })
        }
      },
    })
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  public async findById(postId: Post['id'], options: RepositoryOptions[] = []): Promise<Post | null> {
    let includeComments: Prisma.Post$commentsArgs | boolean = options.includes('comments')
    let includeProducer: boolean | Prisma.ProducerArgs | undefined = undefined

    if (options.includes('comments.childComments') || options.includes('comments.user')) {
      includeComments = {
        include: {
          childComments: {
            include: {
              user: options.includes('comments.childComments.user')
            }
          },
          user: options.includes('comments.user')
        }
      }
    }

    if (options.includes('producer') || options.includes('producer.parentProducer')) {
      includeProducer = {
        include: {
          parentProducer: options.includes('producer.parentProducer')
        }
      }
    }

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
        publishedAt:{
          not: null,
          lte: new Date(),
        },
      },
      include: {
        producer: includeProducer,
        actors: {
          include: {
            actor: options.includes('actors'),
          }
        },
        comments: includeComments,
        meta: options.includes('meta'),
        reactions: options.includes('reactions'),
        tags: {
          include: {
            tag: options.includes('tags')
          }
        }
      },
    })

    if (post === null) {
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
   * @param filters Post filters
   * @return Post if found or null
   */
  public async findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filters: RepositoryFilter<PostRepositoryFilterOption>[]
  ): Promise<PostWithCountInterface[]> {
    let sortCriteria: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> | undefined = undefined
    let whereClause: Prisma.PostWhereInput | undefined = {
      publishedAt: {
        not: null,
      },
      deletedAt: null,
    }

    let includes: Prisma.PostInclude | null | undefined = {
      meta: true,
      producer: true,
    }

    const includeFilters = this.buildIncludes(filters)
    includes = {
      ...includes,
      ...includeFilters
    }

    if (sortingOption === 'date') {
      sortCriteria = {
        publishedAt: sortingCriteria 
      }
    }

    // TODO:Support ORDER BY views

    const whereFilters = this.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
          }
        },
        ...includes
      },
      take: limit,
      skip: offset,
      orderBy: sortCriteria,
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, ['meta', 'producer']),
        postReactions: post._count.reactions,
        postComments: post._count.comments
      }
    })
  }

  /**
   * Count Posts based on filter
   * @param filters Post filters
   * @return Number of posts that accomplish the filters
   */
  public async countPostsWithFilters(
    filters: RepositoryFilter<PostRepositoryFilterOption>[],
  ): Promise<number> {
    let whereClause: Prisma.PostWhereInput | undefined = {
      publishedAt: {
        not: null,
      },
      deletedAt: null,
    }

    const whereFilters = this.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters
    }

    const posts = await prisma.post.count({
      where: whereClause,
    })

    return posts
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
   * @param userId User ID
   * @param postId Post ID
   */
  public async deleteReaction(userId: PostReaction['userId'], postId: PostReaction['postId']): Promise<void> {
    await ObjectionPostReactionModel.query()
      .delete()
      .where('user_id', '=', userId)
      .andWhere('post_id', '=', postId)
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

  private buildFilters(
    filters: RepositoryFilter<PostRepositoryFilterOption>[]
  ): Prisma.PostWhereInput | undefined {
    let whereClause: Prisma.PostWhereInput | undefined = {}

    for (const filter of filters) {
      if (filter.type === 'postTitle') {
        whereClause = {
          ...whereClause,
          OR: [
            {
              title: {
                contains: filter.value,
              },
            },
            {
              description: {
                contains: filter.value
              }
            }
          ]
        }
      }

      if (filter.type.startsWith('producer')) {
        if (filter.type === 'producerId') {
          whereClause = {
            ...whereClause,
            producer: {
              id: filter.value
            }
          }
        }

        if (filter.type === 'producerName') {
          whereClause = {
            ...whereClause,
            producer: {
              name: filter.value
            }
          }
        }
      }

      if (filter.type.startsWith('actor')) {
        if (filter.type === 'actorId') {
          whereClause = {
            ...whereClause,
            actors: {
              some: {
                actor: {
                  id: filter.value
                }
              }
            }
          }
        }

        if (filter.type === 'actorName') {
          whereClause = {
            ...whereClause,
            actors: {
              some: {
                actor: {
                  name: filter.value
                }
              }
            }
          }
        }
      }
    }

    return whereClause
  }

  private buildIncludes(
    filters: RepositoryFilter<PostRepositoryFilterOption>[]
  ): Prisma.PostInclude | null | undefined {
    let includes: Prisma.PostInclude | null | undefined = {}

    for (const filter of filters) {
      if (filter.type.startsWith('producer')) {
        includes = {
          ...includes,
          producer: true,
        }
      }

      if (filter.type.startsWith('actor')) {
        includes = {
          ...includes,
          actors: true,
        }
      }
    }

    return includes
  }
}