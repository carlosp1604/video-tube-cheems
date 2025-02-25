import {
  PostRepositoryInterface,
  RepositoryOptions,
  TopPostOptions
} from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostModelTranslator } from './ModelTranslators/PostModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { PostMetaModelTranslator } from './ModelTranslators/PostMetaModelTranslator'
import { Post as PostPrimaModel, Prisma } from '@prisma/client'
import { PostChildCommentModelTranslator } from './ModelTranslators/PostChildCommentModelTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { prisma } from '~/persistence/prisma'
import {
  PostsWithViewsInterfaceWithTotalCount, PostWithViewsCommentsReactionsInterface,
  PostWithViewsInterface
} from '~/modules/Posts/Domain/PostWithCountInterface'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { Reaction, ReactionableType, ReactionType } from '~/modules/Reactions/Domain/Reaction'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { User } from '~/modules/Auth/Domain/User'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { PostReactionsInterface, PostUserInteraction } from '~/modules/Posts/Domain/PostUserInteraction'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'
import { PostMediaModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/PostMediaModelTranslator'
import { MediaUrlModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/MediaUrlModelTranslator'
import { DateTime } from 'luxon'
import { ViewModelTranslator } from '~/modules/Views/Infrastructure/ViewModelTranslator'
import { View } from '~/modules/Views/Domain/View'
import { PostMediaType } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import PostOrderByWithRelationInput = Prisma.PostOrderByWithRelationInput;
import ViewUncheckedUpdateManyWithoutPostNestedInput = Prisma.ViewUncheckedUpdateManyWithoutPostNestedInput
import ViewUpdateManyWithoutPostNestedInput = Prisma.ViewUpdateManyWithoutPostNestedInput
import PopularPostOrderByWithRelationInput = Prisma.PopularPostOrderByWithRelationInput

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save (post: Post): Promise<void> {
    const prismaPostModel = PostModelTranslator.toDatabase(post, 0)
    const meta = post.meta.map((meta) => PostMetaModelTranslator.toDatabase(meta))
    const translations = Array.from(post.translations.values()).flat()
      .map((translation) => { return TranslationModelTranslator.toDatabase(translation) })

    return prisma.$transaction(async (transaction) => {
      await transaction.post.create({
        data: {
          ...prismaPostModel,
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
                  createdAt: meta.createdAt,
                  updatedAt: meta.updatedAt,
                  deletedAt: meta.deletedAt,
                  type: meta.type,
                  value: meta.value,
                },
              }
            }),
          },
          translations: {
            connectOrCreate: translations.map((translation) => {
              return {
                where: {
                  translatableId_field_translatableType_language: {
                    language: translation.language,
                    translatableType: translation.translatableType,
                    field: translation.field,
                    translatableId: translation.translatableId,
                  },
                },
                create: {
                  createdAt: translation.createdAt,
                  updatedAt: translation.updatedAt,
                  language: translation.language,
                  translatableType: translation.translatableType,
                  field: translation.field,
                  value: translation.value,
                },
              }
            }),
          },
        },
      })

      for (const postMedia of post.postMedia) {
        const postMediaModel = PostMediaModelTranslator.toDatabase(postMedia)
        const mediaUrls = postMedia.mediaUrls.map((mediaUrl) => {
          return MediaUrlModelTranslator.toDatabase(mediaUrl)
        })

        await transaction.postMedia.create({
          data: {
            postId: postMediaModel.postId,
            updatedAt: postMediaModel.updatedAt,
            createdAt: postMediaModel.createdAt,
            type: postMediaModel.type,
            title: postMediaModel.title,
            thumbnailUrl: postMediaModel.thumbnailUrl,
            id: postMediaModel.id,
            mediaUrls: {
              create: mediaUrls.map((mediaUrl) => {
                return {
                  createdAt: mediaUrl.createdAt,
                  updatedAt: mediaUrl.updatedAt,
                  type: mediaUrl.type,
                  title: mediaUrl.title,
                  url: mediaUrl.url,
                  provider: {
                    connect: {
                      id: mediaUrl.mediaProviderId,
                    },
                  },
                }
              }),
            },
          },
        })
      }
    }, { timeout: 100000 })
  }

  /**
   * Specific use-case for post media update
   * Get a post given its slug with its post media
   * Ignore whether post is deleted or is not published
   * @param slug Post Slug
   * @return Post if found or null
   */
  public async getPostBySlugWithPostMedia (slug: Post['slug']): Promise<Post | null> {
    const post = await prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
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

    if (!post) {
      return null
    }

    return PostModelTranslator.toDomain(post, ['postMedia'])
  }

  /**
   * Specific use-case for post media update
   * Update post media
   * v1: Work in replace mode
   * @param post Post
   */
  public async updatePostBySlugWithPostMedia (post: Post): Promise<void> {
    const removedPostMedia = post.removedPostMedia
    const postMedia = post.postMedia

    await prisma.$transaction(async (transaction) => {
      if (postMedia.length > 0) {
        for (const media of postMedia) {
          if (media.type === PostMediaType.VIDEO) {
            continue
          }

          const postMediaModel = PostMediaModelTranslator.toDatabase(media)
          const mediaUrls = media.mediaUrls.map((mediaUrl) => {
            return MediaUrlModelTranslator.toDatabase(mediaUrl)
          })

          await transaction.postMedia.create({
            data: {
              postId: postMediaModel.postId,
              updatedAt: postMediaModel.updatedAt,
              createdAt: postMediaModel.createdAt,
              type: postMediaModel.type,
              title: postMediaModel.title,
              thumbnailUrl: postMediaModel.thumbnailUrl,
              id: postMediaModel.id,
              mediaUrls: {
                create: mediaUrls.map((mediaUrl) => {
                  return {
                    createdAt: mediaUrl.createdAt,
                    updatedAt: mediaUrl.updatedAt,
                    type: mediaUrl.type,
                    title: mediaUrl.title,
                    url: mediaUrl.url,
                    provider: {
                      connect: {
                        id: mediaUrl.mediaProviderId,
                      },
                    },
                  }
                }),
              },
            },
          })
        }
      }

      if (removedPostMedia.length > 0) {
        await transaction.post.update({
          where: {
            slug: post.slug,
          },
          data: {
            postMedia: {
              delete: removedPostMedia.map((removedMedia) => ({
                id: removedMedia.id,
              })),
            },
          },
        })
      }
    }, { timeout: 100000 })
  }

  /**
   * Find a Post (with producer,tags,meta,actors relationships loaded and comments count) given its Slug
   * @param slug Post Slug
   * @return PostWithCount if found or null
   */
  public async findBySlugWithCount (slug: Post['slug']): Promise<PostWithViewsCommentsReactionsInterface | null> {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        // deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      include: {
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
      postViews: Number.parseInt(post.viewsCount.toString()),
    }
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  public async findById (
    postId: Post['id'],
    options: RepositoryOptions[] = []
  ): Promise<Post | PostWithViewsInterface | null> {
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
        reports: options.includes('reports'),
      },
    })

    if (post === null) {
      return null
    }

    if (options.includes('viewsCount')) {
      return {
        post: PostModelTranslator.toDomain(post, options),
        postViews: Number.parseInt(post.viewsCount.toString()),
      }
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
   * @return PostsWithViewsInterfaceWithTotalCount
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostsWithViewsInterfaceWithTotalCount> {
    const includeFilters = MysqlPostRepository.buildIncludes(filters)
    const whereFilters = MysqlPostRepository.buildFilters(filters)
    const sortCriteria = MysqlPostRepository.buildOrder(sortingOption, sortingCriteria)

    const [posts, postsNumber] = await prisma.$transaction([
      prisma.post.findMany({
        where: whereFilters,
        include: {
          ...includeFilters,
        },
        take: limit,
        skip: offset,
        orderBy: sortCriteria,
      }),
      prisma.post.count({
        where: whereFilters,
      }),
    ])

    return {
      posts: posts.map((post) => {
        return {
          post: PostModelTranslator.toDomain(post, ['meta', 'producer', 'actor', 'translations']),
          postViews: Number.parseInt(post.viewsCount.toString()),
        }
      }),
      count: postsNumber,
    }
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
          postViews: Number.parseInt(savedPost.post.viewsCount.toString()),
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
      Prisma.ViewOrderByWithRelationInput | Prisma.ViewOrderByWithRelationInput[] | undefined = {
        post: postsSortCriteria,
      }

    if (sortingOption === 'view-date') {
      sortCriteria = {
        ...sortCriteria,
        createdAt: sortingCriteria,
      }
    }

    const [viewedPosts, posts] = await prisma.$transaction([
      prisma.view.findMany({
        where: {
          userId,
          post: postsWhereFilters,
        },
        include: {
          post: {
            include: {
              ...postsIncludeFilters,
            },
          },
        },
        distinct: ['viewableId'],
        take: limit,
        skip: offset,
        orderBy: sortCriteria,
      }),
      // Prisma doest not support distinct on count :/. Workaround
      prisma.view.findMany({
        where: {
          userId,
          post: postsWhereFilters,
        },
        distinct: 'viewableId',
      }),
    ])

    // We make a cast due to we are sure about the viewable type
    return {
      posts: viewedPosts.map((viewedPost) => {
        return {
          post: PostModelTranslator.toDomain(
            viewedPost.post as PostPrimaModel, ['meta', 'producer', 'actor', 'translations']),
          postViews: viewedPost.post ? Number.parseInt(viewedPost.post.viewsCount.toString()) : 0,
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
        id: {
          not: {
            equals: post.id,
          },
        },
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
      },
      include: {
        meta: true,
        producer: true,
        actor: true,
        translations: true,
      },
      // TODO: Fix this hardcoded number
      take: 20,
      orderBy: {
        viewsCount: 'desc',
      },
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, [
          'meta',
          'producer',
          'translations',
          'actor',
        ]),
        postViews: Number.parseInt(post.viewsCount.toString()),
      }
    })
  }

  /**
   * Get posts published on the specified date
   * @param date Date
   * @return Post array with the posts
   */
  public async getPostsPublishedOnDate (date: Date): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        publishedAt: {
          not: null,
          gte: date,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        meta: true,
        producer: true,
        actor: true,
        translations: true,
      },
      // FIXME: Remove hardcoded limit
      take: 100,
    })

    return posts.map((post) => PostModelTranslator.toDomain(post,
      ['meta', 'producer', 'translations', 'actor']
    ))
  }

  /**
   * Get top (most viewed) posts between 2 given dates
   * @param startDate Start Date
   * @param endDate End Date
   * @return Post array with the posts
   */
  public async getTopPostsBetweenDates (startDate: Date, endDate: Date): Promise<PostWithViewsInterface[]> {
    /*
     * FIXME: At the moment to write this comment, Prisma does not support order by filtered relationships
     * FIXME: When another post type is implemented (pe. gallery), this code could not be working correctly
     * Workaround: Group by and order by views to get most viewed posts. Finally, reorder based on first query
     */
    const views = await prisma.view.groupBy({
      by: ['viewableId'],
      _count: {
        viewableId: true,
      },
      where: {
        createdAt: {
          gt: startDate,
          lt: endDate,
        },
        // viewableType: 'Post',
      },
      orderBy: {
        _count: {
          viewableId: 'desc',
        },
      },
      // TODO: Fix this hardcoded number
      take: 60,
    })

    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
        id: {
          in: views.map((view) => { return view.viewableId }),
        },
      },
      include: {
        meta: true,
        producer: true,
        actor: true,
        translations: true,
      },
    })

    return posts.map((post) => {
      const postViews = views.find((view) => {
        return view.viewableId === post.id
      })

      return {
        post: PostModelTranslator.toDomain(post, [
          'meta',
          'producer',
          'translations',
          'actor',
        ]),
        postViews: postViews?._count.viewableId ?? Number.parseInt(post.viewsCount.toString()),
      }
    }).sort((a, b) => {
      if (a.postViews < b.postViews) {
        return 1
      } else if (a.postViews > b.postViews) {
        return -1
      }

      return 0
    })
  }

  /**
   * Get top (most viewed) posts given an option
   * @param option TopPostOption
   * @param postsNumber Posts to retrieve
   * @return Post array with the posts
   */
  public async getTopPosts (option: TopPostOptions, postsNumber: number): Promise<PostWithViewsInterface[]> {
    let orderByClause: PopularPostOrderByWithRelationInput = {
      todayViews: 'desc',
    }

    if (option === 'week') {
      orderByClause = {
        weekViews: 'desc',
      }
    }

    if (option === 'month') {
      orderByClause = {
        monthViews: 'desc',
      }
    }

    const topPosts = await prisma.popularPost.findMany({
      where: {
        post: {
          deletedAt: null,
          publishedAt: {
            not: null,
            lte: new Date(),
          },
        },
      },
      select: {
        todayViews: true,
        weekViews: true,
        monthViews: true,
        post: {
          include: {
            meta: true,
            producer: true,
            actor: true,
            translations: true,
          },
        },
      },
      orderBy: orderByClause,
      take: postsNumber,
    })

    let paddingPosts :PostWithViewsInterface[] = []

    if (topPosts.length < postsNumber) {
      const extraPosts = await prisma.post.findMany({
        where: {
          deletedAt: null,
          publishedAt: {
            not: null,
            lte: new Date(),
          },
          id: {
            not: {
              in: topPosts.map((topPost) => { return topPost.post.id }),
            },
          },
        },
        include: {
          meta: true,
          producer: true,
          actor: true,
          translations: true,
        },
        take: postsNumber - topPosts.length,
      })

      paddingPosts = extraPosts.map((post) => {
        return {
          post: PostModelTranslator.toDomain(post, [
            'meta',
            'producer',
            'translations',
            'actor',
          ]),
          postViews: 0,
        }
      })
    }

    const posts = topPosts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post.post, [
          'meta',
          'producer',
          'translations',
          'actor',
        ]),
        postViews: option === 'day'
          ? post.todayViews
          : option === 'week'
            ? post.weekViews
            : post.monthViews,
      }
    })

    return [...posts, ...paddingPosts]
  }

  /**
   * Create a new post view for a post given its ID
   * @param postId Post ID
   * @param view Post View
   * @return Post views number
   */
  public async createPostView (postId: Post['id'], view: View | null): Promise<number> {
    let viewData: ViewUncheckedUpdateManyWithoutPostNestedInput |
      ViewUpdateManyWithoutPostNestedInput |
      undefined

    if (view) {
      const prismaPostView = ViewModelTranslator.toDatabase(view)

      viewData = {
        create: {
          id: prismaPostView.id,
          viewableType: prismaPostView.viewableType,
          userId: prismaPostView.userId,
          createdAt: prismaPostView.createdAt,
        },
      }
    }

    return prisma.$transaction(async (transaction) => {
      const post = await transaction.post.update({
        where: {
          id: postId,
        },
        select: {
          viewsCount: true,
        },
        data: {
          viewsCount: {
            increment: 1,
          },
          views: viewData,
        },
      })

      await transaction.$executeRaw(Prisma.sql`
        INSERT INTO popular_posts (post_id, today_views, week_views, month_views) 
        VALUES (${postId}, 1, 1, 1) 
        ON DUPLICATE KEY UPDATE
          today_views = today_views + 1,
          week_views = week_views + 1,
          month_views = month_views + 1;
        `)

      return Number.parseInt(post.viewsCount.toString())
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

  /**
   * Find all post reactions count given its ID
   * @param postId Post ID
   * @return PostReactionsInterface
   */
  public async findPostReactionsCount (postId: Post['id']): Promise<PostReactionsInterface> {
    const [likesCount, dislikesCount] = await prisma.$transaction([
      prisma.reaction.count({
        where: {
          post: {
            id: postId,
          },
          reactionType: ReactionType.LIKE,
        },
      }),
      prisma.reaction.count({
        where: {
          post: {
            id: postId,
          },
          reactionType: ReactionType.DISLIKE,
        },
      }),
    ])

    return {
      likes: likesCount,
      dislikes: dislikesCount,
    }
  }

  /**
   * Get a random post slug
   * @return Post slug
   */
  public async getRandomPostSlug (): Promise<string> {
    const postsCount = await prisma.post.count()

    const post = await prisma.post.findFirst({
      take: 1,
      skip: Math.floor(Math.random() * (postsCount - 1)),
      where: {
        publishedAt: {
          not: null,
        },
        deletedAt: null,
      },
    })

    return post ? post.slug : ''
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
              },
            },
            {
              description: {
                contains: filter.value,
              },
            },
            {
              translations: {
                some: {
                  value: {
                    contains: filter.value,
                  },
                },
              },
            },
          ],
        }
      }

      if (filter.type.startsWith('producer')) {
        if (filter.type === 'producerSlug') {
          whereClause = {
            ...whereClause,
            producer: {
              slug: filter.value,
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

        if (filter.type === 'actorSlug') {
          whereClause = {
            ...whereClause,
            actors: {
              some: {
                actor: {
                  slug: filter.value,
                },
              },
            },
          }
        }
      }

      if (filter.type === 'tagSlug') {
        whereClause = {
          ...whereClause,
          tags: {
            some: {
              tag: {
                slug: filter.value,
              },
            },
          },
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
        viewsCount: sortingCriteria,
      }
    }

    return sortCriteria
  }
}
