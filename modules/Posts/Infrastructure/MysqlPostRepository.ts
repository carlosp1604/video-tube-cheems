import {
  PostRepositoryInterface,
  RepositoryOptions
} from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostModelTranslator } from './ModelTranslators/PostModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { DateTime } from 'luxon'
import { PostMetaModelTranslator } from './ModelTranslators/PostMetaModelTranslator'
import { Prisma } from '@prisma/client'
import { PostChildCommentModelTranslator } from './ModelTranslators/PostChildCommentModelTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { prisma } from '~/persistence/prisma'
import {
  PostsWithViewsInterfaceWithTotalCount,
  PostWithViewsCommentsReactionsInterface, PostWithViewsInterface
} from '~/modules/Posts/Domain/PostWithCountInterface'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { Reaction, ReactionableType, ReactionType } from '~/modules/Reactions/Domain/Reaction'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { PostViewModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/PostViewModelTranslator'
import { User } from '~/modules/Auth/Domain/User'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { PostUserInteraction } from '~/modules/Posts/Domain/PostUserInteraction'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import PostOrderByWithRelationInput = Prisma.PostOrderByWithRelationInput;

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save (post: Post): Promise<void> {
    const prismaPostModel = PostModelTranslator.toDatabase(post)
    const comments = post.comments.map((comment) => PostCommentModelTranslator.toDatabase(comment))
    const meta = post.meta.map((meta) => PostMetaModelTranslator.toDatabase(meta))
    const reactions = post.reactions.map((reaction) => ReactionModelTranslator.toDatabase(reaction))

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
                reactionableType_reactionableId_userId: {
                  reactionableId: post.id,
                  reactionableType: ReactionableType.POST,
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
  public async findBySlugWithCount (slug: Post['slug']): Promise<PostWithViewsCommentsReactionsInterface | null> {
    const postQuery = prisma.post.findFirst({
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
            views: true,
          },
        },
        producer: true,
        actors: {
          include: {
            actor: true,
          },
        },
        actor: true,
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
        postMedia: {
          include: {
            mediaUrls: {
              include: {
                provider: true,
              },
            },
          },
        },
      },
    })

    const countLikesQuery = prisma.reaction.count({
      where: {
        post: {
          slug,
        },
        reactionType: ReactionType.LIKE,
      },
    })

    const countDislikesQuery = prisma.reaction.count({
      where: {
        post: {
          slug,
        },
        reactionType: ReactionType.DISLIKE,
      },
    })

    const [post, likes, dislikes] = await prisma.$transaction([
      postQuery,
      countLikesQuery,
      countDislikesQuery,
    ])

    if (post === null) {
      return null
    }

    return {
      post: PostModelTranslator.toDomain(post, [
        'meta',
        'producer',
        'actors',
        'actor',
        'tags',
        'translations',
        'postMedia',
      ]),
      postComments: post._count.comments,
      postViews: post._count.views,
      reactions: {
        dislike: dislikes,
        like: likes,
      },
    }
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  public async findById (postId: Post['id'], options: RepositoryOptions[] = []): Promise<Post | null> {
    let includeComments: boolean | Prisma.Post$commentsArgs<DefaultArgs> | undefined = false
    let includeProducer: boolean | Prisma.Post$producerArgs<DefaultArgs> | undefined = false
    let includeActors: boolean | Prisma.Post$actorsArgs<DefaultArgs> | undefined = false
    let includeTags: boolean | Prisma.Post$tagsArgs<DefaultArgs> | undefined

    if (options.includes('comments')) {
      includeComments = true
    }

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

    if (options.includes('actors')) {
      includeActors = {
        include: {
          actor: options.includes('actors'),
        },
      }
    }

    if (options.includes('tags')) {
      includeTags = {
        include: {
          tag: options.includes('tags'),
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
        producer: includeProducer,
        actors: includeActors,
        comments: includeComments,
        meta: options.includes('meta'),
        reactions: options.includes('reactions'),
        tags: includeTags,
        translations: options.includes('translations'),
        actor: options.includes('actor'),
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
   * @return Array of PostWithViewsInterface
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostWithViewsInterface[]> {
    const includeFilters = MysqlPostRepository.buildIncludes(filters)
    const whereFilters = MysqlPostRepository.buildFilters(filters)
    const sortCriteria = MysqlPostRepository.buildOrder(sortingOption, sortingCriteria)

    const posts = await prisma.post.findMany({
      where: whereFilters,
      include: {
        _count: {
          select: {
            views: true,
          },
        },
        ...includeFilters,
      },
      take: limit,
      skip: offset,
      orderBy: sortCriteria,
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, ['meta', 'producer', 'actor', 'translations']),
        postViews: post._count.views,
      }
    })
  }

  /**
   * Find SavedPosts based on filter and order criteria
   * @param userId User ID
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filters Post filters
   * @return PostsWithViewsInterfaceWithTotalCount if found or null
   */
  public async findSavedPostsWithOffsetAndLimit (
    userId: string,
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostsWithViewsInterfaceWithTotalCount> {
    const postsIncludeFilters = MysqlPostRepository.buildIncludes(filters)
    const postsWhereFilters = MysqlPostRepository.buildFilters(filters)
    const postsSortCriteria = MysqlPostRepository.buildOrder(sortingOption, sortingCriteria)
    let sortCriteria:
      Prisma.SavedPostOrderByWithRelationInput | Prisma.SavedPostOrderByWithRelationInput[] | undefined = {
        post: postsSortCriteria,
      }

    if (sortingOption === 'saved-date') {
      sortCriteria = {
        ...sortCriteria,
        createdAt: sortingCriteria,
      }
    }

    const [savedPosts, count] = await prisma.$transaction([
      prisma.savedPost.findMany({
        where: {
          userId,
          post: postsWhereFilters,
        },
        include: {
          post: {
            include: {
              _count: {
                select: {
                  views: true,
                },
              },
              ...postsIncludeFilters,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: sortCriteria,
      }),
      prisma.savedPost.count({
        where: {
          userId,
          post: postsWhereFilters,
        },
      }),
    ])

    return {
      posts: savedPosts.map((savedPost) => {
        return {
          post: PostModelTranslator.toDomain(savedPost.post, ['meta', 'producer', 'actor', 'translations']),
          postViews: savedPost.post._count.views,
        }
      }),
      count,
    }
  }

  /**
   * Find ViewedPosts based on filter and order criteria
   * @param userId User ID
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filters Post filters
   * @return PostsWithViewsInterfaceWithTotalCount if found or null
   */
  public async findViewedPostsWithOffsetAndLimit (
    userId: string,
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostsWithViewsInterfaceWithTotalCount> {
    const postsIncludeFilters = MysqlPostRepository.buildIncludes(filters)
    const postsWhereFilters = MysqlPostRepository.buildFilters(filters)
    const postsSortCriteria = MysqlPostRepository.buildOrder(sortingOption, sortingCriteria)
    let sortCriteria:
      Prisma.PostViewOrderByWithRelationInput | Prisma.PostViewOrderByWithRelationInput[] | undefined = {
        post: postsSortCriteria,
      }

    if (sortingOption === 'view-date') {
      sortCriteria = {
        ...sortCriteria,
        createdAt: sortingCriteria,
      }
    }

    const [viewedPosts, posts] = await prisma.$transaction([
      prisma.postView.findMany({
        where: {
          userId,
          post: postsWhereFilters,
        },
        include: {
          post: {
            include: {
              _count: {
                select: {
                  views: true,
                },
              },
              ...postsIncludeFilters,
            },
          },
        },
        distinct: ['postId'],
        take: limit,
        skip: offset,
        orderBy: sortCriteria,
      }),
      // Prisma doest not support distinct on count :/. Workaround
      prisma.postView.findMany({
        where: {
          userId,
          post: postsWhereFilters,
        },
        distinct: 'postId',
      }),
    ])

    return {
      posts: viewedPosts.map((viewedPost) => {
        return {
          post: PostModelTranslator.toDomain(viewedPost.post, ['meta', 'producer', 'actor', 'translations']),
          postViews: viewedPost.post._count.views,
        }
      }),
      count: posts.length,
    }
  }

  /**
   * Count Posts based on filter
   * @param filters Post filters
   * @return Number of posts that accomplish the filters
   */
  public async countPostsWithFilters (
    filters: PostFilterOptionInterface[]
  ): Promise<number> {
    const whereClause = MysqlPostRepository.buildFilters(filters)

    return prisma.post.count({
      where: whereClause,
    })
  }

  /**
   * Add a new Post Reaction
   * @param reaction Reaction
   */
  public async createReaction (reaction: Reaction): Promise<void> {
    const prismaReactionModel = ReactionModelTranslator.toDatabase(reaction)

    await prisma.post.update({
      where: {
        id: reaction.reactionableId,
      },
      data: {
        reactions: {
          create: {
            reactionType: prismaReactionModel.reactionType,
            createdAt: prismaReactionModel.createdAt,
            updatedAt: prismaReactionModel.updatedAt,
            deletedAt: prismaReactionModel.deletedAt,
            userId: prismaReactionModel.userId,
            reactionableType: prismaReactionModel.reactionableType,
          },
        },
      },
    })
  }

  /**
   * Update a new Post Reaction
   * @param reaction Reaction
   */
  public async updateReaction (reaction: Reaction): Promise<void> {
    throw Error()
  }

  /**
   * Delete a new Post Reaction
   * @param userId User ID
   * @param postId Post ID
   */
  public async deleteReaction (userId: Reaction['userId'], postId: Reaction['reactionableId']): Promise<void> {
    await prisma.reaction.delete({
      where: {
        reactionableType_reactionableId_userId: {
          reactionableId: postId,
          reactionableType: ReactionableType.POST,
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
    await prisma.$transaction([
      prisma.postComment.deleteMany({
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
      }),
      prisma.reaction.deleteMany({
        where: {
          reactionableId: commentId,
          reactionableType: ReactionableType.POST_COMMENT,
        },
      }),
    ])
  }

  /**
   * Get posts related to another post given its ID
   * @param postId Post ID
   * @return Post array with the related posts
   */
  public async getRelatedPosts (postId: Post['id']): Promise<PostWithViewsInterface[]> {
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
    let whereActorId: string | Prisma.StringNullableFilter | null | undefined
    let whereActors: Prisma.PostActorListRelationFilter | undefined

    if (post.producerId !== null) {
      whereProducerId = post.producerId
    }

    if (post.actorId !== null) {
      whereActorId = post.actorId
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
          { actorId: whereActorId },
        ],
        id: {
          not: post.id,
        },
      },
      include: {
        _count: {
          select: {
            views: true,
          },
        },
        meta: true,
        producer: true,
        actor: true,
        translations: true,
      },
      // TODO: Fix this hardcoded number
      take: 50,
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, [
          'meta',
          'producer',
          'translations',
          'actor',
        ]),
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
   * Find all user interaction with a post given its IDs
   * @param postId Post ID
   * @param userId User ID
   * @return PostUserInteraction
   */
  public async findUserInteraction (postId: Post['id'], userId: User['id']): Promise<PostUserInteraction> {
    const [reaction, post] = await prisma.$transaction([
      prisma.reaction.findFirst({
        where: {
          reactionableId: postId,
          userId,
        },
      }),
      prisma.savedPost.findFirst({
        where: {
          userId,
          postId,
        },
      }),
    ])

    let userReaction: Reaction | null = null

    if (reaction !== null) {
      userReaction = ReactionModelTranslator.toDomain(reaction)
    }

    const savedPost = post !== null

    return {
      reaction: userReaction,
      savedPost,
    }
  }

  private static buildFilters (
    filters: PostFilterOptionInterface[]
  ): Prisma.PostWhereInput | undefined {
    let whereClause: Prisma.PostWhereInput | undefined = {
      publishedAt: {
        not: null,
      },
      deletedAt: null,
    }

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
    filters: PostFilterOptionInterface[]
  ): Prisma.PostInclude | null | undefined {
    let includes: Prisma.PostInclude | null | undefined = {
      meta: true,
      producer: true,
      actor: true,
      translations: true,
    }

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

  private static buildOrder (
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria
  ): PostOrderByWithRelationInput | undefined {
    let sortCriteria: PostOrderByWithRelationInput | undefined

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

    return sortCriteria
  }
}
