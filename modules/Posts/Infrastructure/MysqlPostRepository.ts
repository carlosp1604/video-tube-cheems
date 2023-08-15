import { PostRepositoryFilterOption, PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostModelTranslator } from './ModelTranslators/PostModelTranslator'
import { PostReactionModelTranslator } from './ModelTranslators/PostReactionModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { DateTime } from 'luxon'
import { PostMetaModelTranslator } from './ModelTranslators/PostMetaModelTranslator'
import { Prisma } from '@prisma/client'
import { PostChildCommentModelTranslator } from './ModelTranslators/PostChildCommentModelTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { prisma } from '~/persistence/prisma'
import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'
import { PostReaction } from '~/modules/Posts/Domain/PostReaction'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { PostViewModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/PostViewModelTranslator'
import { User } from '~/modules/Auth/Domain/User'

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save (post: Post): Promise<void> {
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
                id: comment.id,
              },
              create: {
                ...comment,
              },
            }
          }),
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
              },
            }
          }),
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
              },
            }
          }),
        },
        meta: {
          connectOrCreate: meta.map((meta) => {
            return {
              where: {
                type_postId: {
                  postId: post.id,
                  type: meta.type,
                },
              },
              create: {
                ...meta,
              },
            }
          }),
        },
        reactions: {
          connectOrCreate: reactions.map((reaction) => {
            return {
              where: {
                postId_userId: {
                  postId: post.id,
                  userId: reaction.userId,
                },
              },
              create: {
                ...reaction,
              },
            }
          }),
        },
      },
    })
  }

  /**
   * Find a Post (with producer,tags,meta,actors relationships loaded and reactions/comments count) given its Slug
   * @param slug Post Slug
   * @return PostWithCount if found or null
   */
  public async findBySlugWithCount (slug: Post['slug']): Promise<PostWithCountInterface | null> {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
            views: true,
          },
        },
        producer: true,
        actors: {
          include: {
            actor: true,
          },
        },
        meta: true,
        translations: true,
        tags: {
          include: {
            tag: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    })

    if (post === null) {
      return null
    }

    return {
      post: PostModelTranslator.toDomain(post, [
        'meta',
        'producer',
        'actors',
        'tags',
        'translations',
      ]),
      postReactions: post._count.reactions,
      postComments: post._count.comments,
      postViews: post._count.views,
    }
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  public async findById (postId: Post['id'], options: RepositoryOptions[] = []): Promise<Post | null> {
    let includeComments: Prisma.Post$commentsArgs | boolean = options.includes('comments')
    let includeProducer: boolean | Prisma.ProducerArgs | undefined = false

    if (options.includes('comments.user')) {
      includeComments = {
        include: {
          user: options.includes('comments.user'),
        },
      }
    }

    if (options.includes('comments.childComments')) {
      includeComments = {
        include: {
          childComments: {
            include: {
              user: options.includes('comments.childComments.user'),
            },
          },
          user: options.includes('comments.user'),
        },
      }
    }

    if (options.includes('producer') || options.includes('producer.parentProducer')) {
      includeProducer = {
        include: {
          parentProducer: options.includes('producer.parentProducer'),
        },
      }
    }

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
        producer: includeProducer,
        actors: {
          include: {
            actor: options.includes('actors'),
          },
        },
        comments: includeComments,
        meta: options.includes('meta'),
        reactions: options.includes('reactions'),
        tags: {
          include: {
            tag: options.includes('tags'),
          },
        },
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
   * @return PostWithCount if found or null
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filters: PostRepositoryFilterOption[]
  ): Promise<PostWithCountInterface[]> {
    let sortCriteria: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> | undefined
    let whereClause: Prisma.PostWhereInput | undefined = {
      publishedAt: {
        not: null,
      },
      deletedAt: null,
    }

    let includes: Prisma.PostInclude | null | undefined = {
      meta: true,
      producer: true,
      translations: true,
    }

    const includeFilters = MysqlPostRepository.buildIncludes(filters)

    includes = {
      ...includes,
      ...includeFilters,
    }

    if (sortingOption === 'date') {
      sortCriteria = {
        publishedAt: sortingCriteria,
      }
    }

    if (sortingOption === 'views') {
      sortCriteria = {
        views: {
          _count: sortingCriteria,
        },
      }
    }

    const whereFilters = MysqlPostRepository.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters,
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
            views: true,
          },
        },
        ...includes,
      },
      take: limit,
      skip: offset,
      orderBy: sortCriteria,
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, [
          'meta',
          'producer',
          'translations',
        ]),
        postReactions: post._count.reactions,
        postComments: post._count.comments,
        postViews: post._count.views,
      }
    })
  }

  /**
   * Count Posts based on filter
   * @param filters Post filters
   * @return Number of posts that accomplish the filters
   */
  public async countPostsWithFilters (
    filters: PostRepositoryFilterOption[]
  ): Promise<number> {
    let whereClause: Prisma.PostWhereInput | undefined = {
      publishedAt: {
        not: null,
      },
      deletedAt: null,
    }

    const whereFilters = MysqlPostRepository.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters,
    }

    return prisma.post.count({
      where: whereClause,
    })
  }

  /**
   * Add a new Post Reaction
   * @param reaction PostReaction
   */
  public async createReaction (reaction: PostReaction): Promise<void> {
    const prismaPostReactionModel = PostReactionModelTranslator.toDatabase(reaction)

    await prisma.post.update({
      where: {
        id: reaction.postId,
      },
      data: {
        reactions: {
          create: {
            reactionType: prismaPostReactionModel.reactionType,
            createdAt: prismaPostReactionModel.createdAt,
            updatedAt: prismaPostReactionModel.updatedAt,
            deletedAt: prismaPostReactionModel.deletedAt,
            userId: prismaPostReactionModel.userId,
          },
        },
      },
    })
  }

  /**
   * Update a new Post Reaction
   * @param reaction PostReaction
   */
  public async updateReaction (reaction: PostReaction): Promise<void> {
    throw Error()
  }

  /**
   * Delete a new Post Reaction
   * @param userId User ID
   * @param postId Post ID
   */
  public async deleteReaction (userId: PostReaction['userId'], postId: PostReaction['postId']): Promise<void> {
    await prisma.postReaction.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })
  }

  /**
   * Add a new Post Comment
   * @param comment PostComment
   */
  public async createComment (comment: PostComment): Promise<void> {
    const prismaPostCommentModel = PostCommentModelTranslator.toDatabase(comment)

    await prisma.post.update({
      where: {
        id: comment.postId,
      },
      data: {
        comments: {
          create: {
            id: prismaPostCommentModel.id,
            comment: prismaPostCommentModel.comment,
            userId: prismaPostCommentModel.userId,
            parentCommentId: prismaPostCommentModel.parentCommentId,
            createdAt: prismaPostCommentModel.createdAt,
            deletedAt: prismaPostCommentModel.deletedAt,
            updatedAt: prismaPostCommentModel.updatedAt,
          },
        },
      },
    })
  }

  /**
   * Add a new Post Child Comment
   * @param childComment Post Child Comment
   */
  public async createChildComment (childComment: PostChildComment): Promise<void> {
    const prismaChildCommentModel = PostChildCommentModelTranslator.toDatabase(childComment)

    await prisma.postComment.update({
      where: {
        id: childComment.parentCommentId,
      },
      data: {
        childComments: {
          create: {
            id: prismaChildCommentModel.id,
            comment: prismaChildCommentModel.comment,
            userId: prismaChildCommentModel.userId,
            createdAt: prismaChildCommentModel.createdAt,
            updatedAt: prismaChildCommentModel.updatedAt,
            deletedAt: prismaChildCommentModel.deletedAt,
          },
        },
      },
    })
  }

  /**
   * Update a Post Comment
   * @param commentId Post Comment ID
   * @param comment Post Comment comment
   */
  public async updateComment (
    commentId: PostComment['id'],
    comment: PostComment['comment']
  ): Promise<void> {
    throw Error()
  }

  /**
   * Delete a Post Comment
   * @param commentId Post Comment ID
   */
  public async deleteComment (commentId: PostComment['id']): Promise<void> {
    await prisma.postComment.deleteMany({
      where: {
        OR: [
          {
            id: commentId,
          },
          {
            parentCommentId: commentId,
          },
        ],
      },
    })
  }

  /**
   * Get posts related to another post given its ID
   * @param postId Post ID
   * @return Post array with the related posts
   */
  public async getRelatedPosts (postId: Post['id']): Promise<PostWithCountInterface[]> {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        actors: true,
        producer: true,
      },
    })

    if (post === null) {
      return []
    }

    let whereProducerId: string | Prisma.StringNullableFilter | null | undefined
    let whereActors: Prisma.PostActorListRelationFilter | undefined

    if (post.producerId !== null) {
      whereProducerId = post.producerId
    }

    if (post.actors.length > 0) {
      whereActors = {
        some: {
          actorId: {
            in: post.actors.map(
              (actor) => {
                return actor.actorId
              }
            ),
          },
        },
      }
    }

    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
        OR: [
          { producerId: whereProducerId },
          { actors: whereActors },
        ],
      },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
            views: true,
          },
        },
        meta: true,
        producer: true,
        translations: true,
      },
      take: 50,
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, [
          'meta',
          'producer',
          'translations',
        ]),
        postReactions: post._count.reactions,
        postComments: post._count.comments,
        postViews: post._count.views,
      }
    })
  }

  /**
   * Create a new post view for a post given its ID
   * @param postId Post ID
   * @param postView Post View
   */
  public async createPostView (postId: Post['id'], postView: PostView): Promise<void> {
    const prismaPostView = PostViewModelTranslator.toDatabase(postView)

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          create: {
            id: prismaPostView.id,
            userId: prismaPostView.userId,
            createdAt: prismaPostView.createdAt,
          },
        },
      },
    })
  }

  /**
   * Find a user reaction for a post given its IDs
   * @param postId Post ID
   * @param userId User ID
   * @return Post Reaction if found or null
   */
  public async findUserReaction (postId: Post['id'], userId: User['id']): Promise<PostReaction | null> {
    const postReaction = await prisma.postReaction.findFirst({
      where: {
        postId,
        userId,
      },
    })

    if (postReaction === null) {
      return null
    }

    return PostReactionModelTranslator.toDomain(postReaction)
  }

  private static buildFilters (
    filters: PostRepositoryFilterOption[]
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
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: filter.value,
                mode: 'insensitive',
              },
            },
            {
              translations: {
                some: {
                  value: {
                    contains: filter.value,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        }
      }

      if (filter.type.startsWith('producer')) {
        if (filter.type === 'producerId') {
          whereClause = {
            ...whereClause,
            producer: {
              id: filter.value,
            },
          }
        }

        if (filter.type === 'producerName') {
          whereClause = {
            ...whereClause,
            producer: {
              name: filter.value,
            },
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
                  id: filter.value,
                },
              },
            },
          }
        }

        if (filter.type === 'actorName') {
          whereClause = {
            ...whereClause,
            actors: {
              some: {
                actor: {
                  name: filter.value,
                },
              },
            },
          }
        }
      }
    }

    return whereClause
  }

  private static buildIncludes (
    filters: PostRepositoryFilterOption[]
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
