import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostMetaModelTranslator } from './PostMetaModelTranslator'
import { PostTagModelTranslator } from './PostTagModelTranslator'
import { ActorModelTranslator } from './ActorModelTranslator'
import { DateTime } from 'luxon'
import { PostCommentModelTranslator } from './PostCommentModelTranslator'
import { PostReactionModelTranslator } from './PostReactionModelTranslator'
import { Post as PostPrismaModel } from '@prisma/client'
import {
  PostWithActors,
  PostWithComments,
  PostWithMeta,
  PostWithProducerWithParent,
  PostWithReactions,
  PostWithTags
} from '~/modules/Posts/Infrastructure/PrismaModels/PostModel'
import { Post } from '~/modules/Posts/Domain/Post'
import { ProducerModelTranslator } from '~/modules/Producers/Infrastructure/ProducerModelTranslator'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostTag } from '~/modules/Posts/Domain/PostTag'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { PostReaction } from '~/modules/Posts/Domain/PostReaction'

export class PostModelTranslator {
  public static toDomain (
    prismaPostModel: PostPrismaModel,
    options: RepositoryOptions[] = []
  ) {
    let publishedAt: DateTime | null = null
    let deletedAt: DateTime | null = null

    if (prismaPostModel.publishedAt !== null) {
      publishedAt = DateTime.fromJSDate(prismaPostModel.publishedAt)
    }

    if (prismaPostModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostModel.deletedAt)
    }

    let metaCollection: Collection<PostMeta, PostMeta['type']> = Collection.notLoaded()
    let tagsCollection: Collection<PostTag, PostTag['id']> = Collection.notLoaded()
    let actorsCollection: Collection<Actor, Actor['id']> = Collection.notLoaded()
    let commentsCollection: Collection<PostComment, PostComment['id']> = Collection.notLoaded()
    let reactionsCollection: Collection<PostReaction, PostReaction['userId']> = Collection.notLoaded()
    let producerRelationship: Relationship<Producer | null> = Relationship.notLoaded()

    if (options.includes('meta')) {
      metaCollection = Collection.initializeCollection()
      const postWithMeta = prismaPostModel as PostWithMeta

      for (let i = 0; i < postWithMeta.meta.length; i++) {
        const postMetaDomain = PostMetaModelTranslator.toDomain(postWithMeta.meta[i])

        metaCollection.addItemFromPersistenceLayer(postMetaDomain, postMetaDomain.type)
      }
    }

    if (options.includes('tags')) {
      tagsCollection = Collection.initializeCollection()
      const postWithTags = prismaPostModel as PostWithTags

      for (let i = 0; i < postWithTags.tags.length; i++) {
        const postTagDomain = PostTagModelTranslator.toDomain(postWithTags.tags[i].tag)

        tagsCollection.addItemFromPersistenceLayer(postTagDomain, postTagDomain.id)
      }
    }

    if (options.includes('actors')) {
      actorsCollection = Collection.initializeCollection()
      const postWithActor = prismaPostModel as PostWithActors

      for (let i = 0; i < postWithActor.actors.length; i++) {
        const actorDomain = ActorModelTranslator.toDomain(postWithActor.actors[i].actor)

        actorsCollection.addItemFromPersistenceLayer(actorDomain, actorDomain.id)
      }
    }

    if (options.includes('comments')) {
      commentsCollection = Collection.initializeCollection()
      const postWithComments = prismaPostModel as PostWithComments

      for (let i = 0; i < postWithComments.comments.length; i++) {
        const commentDomain = PostCommentModelTranslator.toDomain(
          postWithComments.comments[i], options
        )

        commentsCollection.addItemFromPersistenceLayer(commentDomain, commentDomain.id)
      }
    }

    if (options.includes('reactions')) {
      reactionsCollection = Collection.initializeCollection()
      const postWithReactions = prismaPostModel as PostWithReactions

      for (let i = 0; i < postWithReactions.reactions.length; i++) {
        const reactionDomain = PostReactionModelTranslator.toDomain(postWithReactions.reactions[i])

        reactionsCollection.addItemFromPersistenceLayer(reactionDomain, reactionDomain.userId)
      }
    }

    if (options.includes('producer')) {
      const postWithProducer = prismaPostModel as PostWithProducerWithParent

      if (postWithProducer.producer !== null) {
        const producerDomain = ProducerModelTranslator.toDomain(postWithProducer.producer)

        producerRelationship = Relationship.initializeRelation(producerDomain)
      } else {
        producerRelationship = Relationship.initializeRelation(null)
      }
    }

    return new Post(
      prismaPostModel.id,
      prismaPostModel.title,
      prismaPostModel.description,
      prismaPostModel.slug,
      prismaPostModel.producerId,
      DateTime.fromJSDate(prismaPostModel.createdAt),
      DateTime.fromJSDate(prismaPostModel.updatedAt),
      deletedAt,
      publishedAt,
      metaCollection,
      tagsCollection,
      actorsCollection,
      commentsCollection,
      reactionsCollection,
      Collection.notLoaded(),
      producerRelationship
    )
  }

  public static toDatabase (post: Post): PostPrismaModel {
    return {
      id: post.id,
      description: post.description,
      slug: post.slug,
      title: post.title,
      producerId: post.producerId,
      publishedAt: post.publishedAt?.toJSDate() ?? null,
      createdAt: post.createdAt.toJSDate(),
      deletedAt: post.deletedAt?.toJSDate() ?? null,
      updatedAt: post.updatedAt.toJSDate(),
    }
  }
}
