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
  PostWithProducer,
  PostWithProducerWithParent,
  PostWithReactions,
  PostWithTags
} from '~/modules/Posts/Infrastructure/PrismaModels/PostModel'
import { Post } from '~/modules/Posts/Domain/Post'
import { ProducerModelTranslator } from '~/modules/Producers/Infrastructure/ProducerModelTranslator'

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

    const post = new Post(
      prismaPostModel.id,
      prismaPostModel.title,
      prismaPostModel.description,
      prismaPostModel.producerId,
      DateTime.fromJSDate(prismaPostModel.createdAt),
      DateTime.fromJSDate(prismaPostModel.updatedAt),
      deletedAt,
      publishedAt
    )

    if (options.includes('meta')) {
      const postWithMeta = prismaPostModel as PostWithMeta

      for (let i = 0; i < postWithMeta.meta.length; i++) {
        const postMetaDomain = PostMetaModelTranslator.toDomain(postWithMeta.meta[i])

        post.addMeta(postMetaDomain)
      }
    }

    if (options.includes('tags')) {
      const postWithTags = prismaPostModel as PostWithTags

      for (let i = 0; i < postWithTags.tags.length; i++) {
        const postTagDomain = PostTagModelTranslator.toDomain(postWithTags.tags[i].tag)

        post.addTag(postTagDomain)
      }
    }

    if (options.includes('actors')) {
      const postWithActor = prismaPostModel as PostWithActors

      for (let i = 0; i < postWithActor.actors.length; i++) {
        const actorDomain = ActorModelTranslator.toDomain(postWithActor.actors[i].actor)

        post.addActor(actorDomain)
      }
    }

    if (options.includes('comments')) {
      const postWithComments = prismaPostModel as PostWithComments

      for (let i = 0; i < postWithComments.comments.length; i++) {
        const commentDomain = PostCommentModelTranslator.toDomain(
          postWithComments.comments[i], options
        )

        post.createComment(commentDomain)
      }
    }

    if (options.includes('reactions')) {
      const postWithReactions = prismaPostModel as PostWithReactions

      for (let i = 0; i < postWithReactions.reactions.length; i++) {
        const reactionDomain = PostReactionModelTranslator.toDomain(postWithReactions.reactions[i])

        post.addPostReaction(reactionDomain)
      }
    }

    if (options.includes('producer') || options.includes('producer.parentProducer')) {
      if (options.includes('producer.parentProducer')) {
        const postWithProducer = prismaPostModel as PostWithProducer

        if (postWithProducer.producer !== null) {
          const producerDomain = ProducerModelTranslator.toDomain(postWithProducer.producer, [])

          post.setProducer(producerDomain)
        }
      } else {
        const postWithProducer = prismaPostModel as PostWithProducerWithParent

        if (postWithProducer.producer !== null) {
          const producerDomain = ProducerModelTranslator.toDomain(postWithProducer.producer, options)

          post.setProducer(producerDomain)
        }
      }
    }

    return post
  }

  public static toDatabase (post: Post): PostPrismaModel {
    return {
      id: post.id,
      description: post.description,
      title: post.title,
      producerId: post.producerId,
      publishedAt: post.publishedAt?.toJSDate() ?? null,
      createdAt: post.createdAt.toJSDate(),
      deletedAt: post.deletedAt?.toJSDate() ?? null,
      updatedAt: post.updatedAt.toJSDate(),
    }
  }
}
