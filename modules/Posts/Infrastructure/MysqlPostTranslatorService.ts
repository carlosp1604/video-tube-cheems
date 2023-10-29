import { DateTime } from 'luxon'
import { Post } from '~/modules/Posts/Domain/Post'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostWithRelationsRawModel } from '~/modules/Posts/Infrastructure/RawSql/PostRawModel'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { PostTag } from '~/modules/Posts/Domain/PostTag'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Producer } from '~/modules/Producers/Domain/Producer'

export class MysqlPostsTranslatorService {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly options: RepositoryOptions[]) {}

  public fromRowsToDomain (rows: PostWithRelationsRawModel[]): Post[] {
    const posts = new Map<PostWithRelationsRawModel['id'], Post>()

    rows.forEach((row) => {
      if (!posts.has(row.id)) {
        let deletedAt: DateTime | null = null
        let publishedAt: DateTime | null = null

        if (row.deleted_at !== null) {
          deletedAt = DateTime.fromJSDate(row.deleted_at)
        }

        if (row.published_at !== null) {
          publishedAt = DateTime.fromJSDate(row.published_at)
        }

        const metaCollection = this.initializeMetaCollection(row)
        const tagsCollection = this.initializeTagsCollection(row)
        const actorsCollection = this.initializeActorsCollection(row)
        const commentsCollection = this.initializeCommentsCollection(row)
        const reactionsCollection = this.initializeReactionsCollection((row))
        const viewsCollections = this.initializeViewsCollection(row)
        const translationsCollection = this.initializeTranslationsCollection(row)
        const postMediaCollection = this.initializePostMediaCollection(row)

        const actorRelationship =
          this.buildActorRelationshipIdNeeded(row)

        const producerRelationship =
          this.buildProducerRelationshipIdNeeded(row)

        const post = new Post(
          row.id,
          row.title,
          row.type,
          row.description,
          row.slug,
          row.producer_id,
          row.actor_id,
          DateTime.fromJSDate(row.created_at),
          DateTime.fromJSDate(row.updated_at),
          deletedAt,
          publishedAt,
          metaCollection,
          tagsCollection,
          actorsCollection,
          commentsCollection,
          reactionsCollection,
          viewsCollections,
          producerRelationship,
          translationsCollection,
          actorRelationship,
          postMediaCollection
        )

        posts.set(row.id, post)
      } else {
        const post = posts.get(row.id) as Post

        this.addMetaIfNeeded(row, post)
        // this.addTagIfNeeded(row, post)
        // this.addActorIfNeeded(row, post)
        // this.addCommentIfNeeded(row, post)
        // this.addReactionIfNeeded(row, post)
        // this.addViewIfNeeded(row, post)
        this.addTranslationIfNeeded(row, post)
        // this.addPostMediaIfNeeded(row, post)
      }
    })

    return Array.from(posts.values())
  }

  private buildProducerRelationshipIdNeeded (
    row: PostWithRelationsRawModel
  ): Relationship<Producer | null> {
    let relationship: Relationship<Producer | null> = Relationship.notLoaded()

    if (this.options.includes('producer')) {
      if (row.actor_id) {
        let deletedAt: DateTime | null = null

        if (row.producer_deleted_at !== null) {
          deletedAt = DateTime.fromJSDate(row.producer_deleted_at)
        }

        const producer = new Producer(
          row.producer_id,
          row.producer_name,
          row.producer_description,
          row.producer_image_url,
          row.producer_parent_producer_id,
          row.producer_brand_hex_color,
          DateTime.fromJSDate(row.producer_created_at),
          DateTime.fromJSDate(row.producer_updated_at),
          deletedAt
        )

        relationship = Relationship.initializeRelation(producer)
      }
    }

    return relationship
  }

  private buildActorRelationshipIdNeeded (
    row: PostWithRelationsRawModel
  ): Relationship<Actor | null> {
    let relationship: Relationship<Actor | null> = Relationship.notLoaded()

    if (this.options.includes('actor')) {
      if (row.actor_id) {
        let deletedAt: DateTime | null = null

        if (row.actor_deleted_at !== null) {
          deletedAt = DateTime.fromJSDate(row.actor_deleted_at)
        }

        const actor = new Actor(
          row.actor_id,
          row.actor_name,
          row.actor_description,
          row.actor_image_url,
          DateTime.fromJSDate(row.actor_created_at),
          DateTime.fromJSDate(row.actor_updated_at),
          deletedAt
        )

        relationship = Relationship.initializeRelation(actor)
      }
    }

    return relationship
  }

  private initializeMetaCollection (
    row: PostWithRelationsRawModel
  ): Collection<PostMeta, PostMeta['type']> {
    let collection: Collection<PostMeta, PostMeta['type']> = Collection.notLoaded()

    if (this.options.includes('meta')) {
      collection = Collection.initializeCollection()

      const meta = this.buildMeta(row)

      if (meta) {
        collection.addItem(meta, meta.type)
      }
    }

    return collection
  }

  private initializeTranslationsCollection (
    row: PostWithRelationsRawModel
  ): Collection<Translation, Translation['language'] & Translation['field']> {
    let collection: Collection<Translation, Translation['language'] & Translation['field']> = Collection.notLoaded()

    if (this.options.includes('translations')) {
      collection = Collection.initializeCollection()

      const translation = this.buildTranslation(row)

      if (translation) {
        collection.addItem(translation, translation.language + translation.field)
      }
    }

    return collection
  }

  // TODO: Implement this
  private initializeTagsCollection (
    row: PostWithRelationsRawModel
  ): Collection<PostTag, PostTag['id']> {
    return Collection.notLoaded<PostTag, PostTag['id']>()
  }

  // TODO: Implement this
  private initializeActorsCollection (
    row: PostWithRelationsRawModel
  ): Collection<Actor, Actor['id']> {
    return Collection.notLoaded<Actor, Actor['id']>()
  }

  // TODO: Implement this
  private initializeCommentsCollection (
    row: PostWithRelationsRawModel
  ): Collection<PostComment, PostComment['id']> {
    return Collection.notLoaded<PostComment, PostComment['id']>()
  }

  // TODO: Implement this
  private initializeReactionsCollection (
    row: PostWithRelationsRawModel
  ): Collection<Reaction, Reaction['userId']> {
    return Collection.notLoaded<Reaction, Reaction['userId']>()
  }

  // TODO: Implement this
  private initializeViewsCollection (
    row: PostWithRelationsRawModel
  ): Collection<PostView, PostView['id']> {
    return Collection.notLoaded<PostView, PostView['id']>()
  }

  // TODO: Implement this
  private initializePostMediaCollection (
    row: PostWithRelationsRawModel
  ): Collection<PostMedia, PostMedia['id']> {
    return Collection.notLoaded<PostMedia, PostMedia['id']>()
  }

  private addMetaIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    if (this.options.includes('meta')) {
      const meta = this.buildMeta(row)

      if (meta) {
        post.addMeta(meta)
      }
    }
  }

  private addTranslationIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    if (this.options.includes('translations')) {
      const translation = this.buildTranslation(row)

      if (translation) {
        post.addTranslation(translation)
      }
    }
  }

  private addActorIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    throw Error('Not implemented')
  }

  private addTagIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    throw Error('Not implemented')
  }

  private addCommentIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    throw Error('Not implemented')
  }

  private addReactionIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    throw Error('Not implemented')
  }

  private addViewIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    throw Error('Not implemented')
  }

  private addPostMediaIfNeeded (row: PostWithRelationsRawModel, post: Post): void {
    throw Error('Not implemented')
  }

  private buildMeta (row: PostWithRelationsRawModel): PostMeta | null {
    if (row.meta_post_id === null) {
      return null
    }

    let deletedAt: DateTime | null = null

    if (row.meta_deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(row.meta_deleted_at)
    }

    return new PostMeta(
      row.meta_type,
      row.meta_value,
      row.meta_post_id,
      DateTime.fromJSDate(row.meta_created_at),
      DateTime.fromJSDate(row.meta_updated_at),
      deletedAt
    )
  }

  private buildTranslation (row: PostWithRelationsRawModel): Translation | null {
    if (row.translation_translatable_id === null) {
      return null
    }

    return new Translation(
      row.translation_translatable_id,
      row.translation_translatable_type,
      row.translation_field,
      row.translation_value,
      row.translation_language,
      DateTime.fromJSDate(row.translation_created_at),
      DateTime.fromJSDate(row.translation_updated_at)
    )
  }
}
