import { DateTime } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { PostTag } from '~/modules/Posts/Domain/PostTag'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { PostReaction } from '~/modules/Posts/Domain/PostReaction'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Post } from '~/modules/Posts/Domain/Post'
import { Translation } from '~/modules/Translations/Domain/Translation'

/**
 * Post model builder for tests
 */
export class TestPostBuilder {
  private id: string
  private title: string
  private description: string
  private slug: string
  private producerId: string | null
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null
  private publishedAt: DateTime | null
  private _meta: Collection<PostMeta, PostMeta['type']>
  private _tags: Collection<PostTag, PostTag['id']>
  private _actors: Collection<Actor, Actor['id']>
  private _comments: Collection<PostComment, PostComment['id']>
  private _reactions: Collection<PostReaction, PostReaction['userId']>
  private _views: Collection<PostView, PostView['id']>
  private _producer: Relationship<Producer | null>
  private _translations: Collection<Translation, string>

  constructor () {
    this.id = 'test-post-id'
    this.title = 'test-post-title'
    this.description = 'test-post-description'
    this.slug = 'test-post-slug'
    this.producerId = null
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
    this.publishedAt = null
    this._meta = Collection.notLoaded()
    this._tags = Collection.notLoaded()
    this._actors = Collection.notLoaded()
    this._comments = Collection.notLoaded()
    this._reactions = Collection.notLoaded()
    this._views = Collection.notLoaded()
    this._producer = Relationship.notLoaded()
    this._translations = Collection.notLoaded()
  }

  public build (): Post {
    return new Post(
      this.id,
      this.title,
      this.description,
      this.slug,
      this.producerId,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
      this.publishedAt,
      this._meta,
      this._tags,
      this._actors,
      this._comments,
      this._reactions,
      this._views,
      this._producer,
      this._translations
    )
  }

  public withId (id: string): TestPostBuilder {
    this.id = id

    return this
  }

  public withTitle (title: string): TestPostBuilder {
    this.title = title

    return this
  }

  public withDescription (description: string): TestPostBuilder {
    this.description = description

    return this
  }

  public withSlug (slug: string): TestPostBuilder {
    this.slug = slug

    return this
  }

  public withProducerId (producerId: string | null): TestPostBuilder {
    this.producerId = producerId

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostBuilder {
    this.createdAt = createdAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestPostBuilder {
    this.deletedAt = deletedAt

    return this
  }

  public withPublishedAt (publishedAt: DateTime | null): TestPostBuilder {
    this.publishedAt = publishedAt

    return this
  }

  public withMeta (metaCollection: Collection<PostMeta, PostMeta['type']>): TestPostBuilder {
    this._meta = metaCollection

    return this
  }

  public withProducer (producer: Relationship<Producer | null>): TestPostBuilder {
    this._producer = producer

    return this
  }

  public withTags (tags: Collection<PostTag, PostTag['id']>): TestPostBuilder {
    this._tags = tags

    return this
  }

  public withActors (actors: Collection<Actor, Actor['id']>): TestPostBuilder {
    this._actors = actors

    return this
  }

  public withTranslations (translations: Collection<Translation, string>): TestPostBuilder {
    this._translations = translations

    return this
  }
}
