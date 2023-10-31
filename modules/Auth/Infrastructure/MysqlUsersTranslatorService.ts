import { DateTime } from 'luxon'
import { User } from '~/modules/Auth/Domain/User'
import { UserRepositoryOptions } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { UserWithRelationsRawModel } from '~/modules/Auth/Infrastructure/RawSql/UserRawModel'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { Post } from '~/modules/Posts/Domain/Post'

export class MysqlUsersTranslatorService {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly options: UserRepositoryOptions[]) {}

  public fromRowsToDomain (rows: UserWithRelationsRawModel[]): User[] {
    const users = new Map<UserWithRelationsRawModel['id'], User>()

    rows.forEach((row) => {
      if (!users.has(row.id)) {
        let deletedAt: DateTime | null = null
        let emailVerified: DateTime | null = null

        if (row.deleted_at !== null) {
          deletedAt = DateTime.fromJSDate(row.deleted_at)
        }

        if (row.email_verified !== null) {
          emailVerified = DateTime.fromJSDate(row.email_verified)
        }

        const verificationToken =
          this.buildVerificationTokenRelationshipIdNeeded(row)

        const savedPostsCollection =
          this.initializeSavedPostsCollection(row)

        const user = new User(
          row.id,
          row.name,
          row.username,
          row.email,
          row.image_url,
          row.language,
          row.password,
          DateTime.fromJSDate(row.created_at),
          DateTime.fromJSDate(row.updated_at),
          emailVerified,
          deletedAt,
          verificationToken,
          savedPostsCollection
        )

        users.set(row.id, user)
      } else {
        const user = users.get(row.id) as User

        this.addSavedPostIfNeeded(row, user)
      }
    })

    return Array.from(users.values())
  }

  private buildVerificationTokenRelationshipIdNeeded (
    row: UserWithRelationsRawModel
  ): Relationship<VerificationToken | null> {
    let relationship: Relationship<VerificationToken | null> = Relationship.notLoaded()

    if (this.options.includes('verificationToken')) {
      if (row.verification_token_id) {
        const verificationToken = new VerificationToken(
          row.verification_token_id,
          row.verification_token_token,
          row.verification_token_user_email,
          row.verification_token_type,
          DateTime.fromJSDate(row.verification_token_expires_at),
          DateTime.fromJSDate(row.verification_token_created_at)
        )

        relationship = Relationship.initializeRelation(verificationToken)
      } else {
        relationship = Relationship.initializeRelation(null)
      }
    }

    return relationship
  }

  private initializeSavedPostsCollection (
    row: UserWithRelationsRawModel
  ): Collection<Post, Post['id']> {
    let collection: Collection<Post, Post['id']> = Collection.notLoaded()

    if (this.options.includes('savedPosts')) {
      collection = Collection.initializeCollection()

      const post = this.buildPost(row)

      if (post) {
        collection.addItem(post, post.id)
      }
    }

    return collection
  }

  private addSavedPostIfNeeded (row: UserWithRelationsRawModel, user: User): void {
    if (this.options.includes('savedPosts')) {
      const post = this.buildPost(row)

      if (post) {
        user.addSavedPost(post)
      }
    }
  }

  private buildPost (row: UserWithRelationsRawModel): Post | null {
    if (row.post_id === null) {
      return null
    }
    let deletedAt: DateTime | null = null
    let publishedAt: DateTime | null = null

    if (row.post_deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(row.post_deleted_at)
    }

    if (row.post_published_at !== null) {
      publishedAt = DateTime.fromJSDate(row.post_published_at)
    }

    // Currently, a post loaded from user does not support relationships loading
    return new Post(
      row.post_id,
      row.post_title,
      row.post_type,
      row.post_description,
      row.post_slug,
      row.post_producer_id,
      row.post_actor_id,
      DateTime.fromJSDate(row.post_created_at),
      DateTime.fromJSDate(row.post_updated_at),
      deletedAt,
      publishedAt
    )
  }
}
