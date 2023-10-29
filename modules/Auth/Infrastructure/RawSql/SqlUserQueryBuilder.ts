import { User } from '~/modules/Auth/Domain/User'
import { UserRepositoryOptions } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Sql } from 'prisma/prisma-client/runtime/library'
import { Prisma } from '.prisma/client'

// eslint-disable-next-line max-len
const verificationTokenSelects = 'vt.id AS verification_token_id, vt.token AS verification_token_token, vt.user_email AS verification_token_user_email, vt.type AS verification_token_type, vt.expires_at AS verification_token_expires_at, vt.created_at AS verification_token_created_at'
// eslint-disable-next-line max-len
const savedPostsSelects = 'p.id AS post_id, p.title AS post_title, p.type AS post_type, p.description AS post_description, p.slug AS post_slug, p.created_at AS post_created_at, p.updated_at AS post_updated_at, p.published_at AS post_published_at, p.deleted_at AS post_deleted_at, p.producer_id AS post_producer_id, p.actor_id AS post_actor_id'

export class SqlUserQueryBuilder {
  public static findUserByEmail (userEmail: User['email'], options: UserRepositoryOptions[]): Sql {
    const select = this.buildSelect(options)

    const joinClauses = this.buildJoin(options)

    return Prisma.sql`
      ${select}
      FROM users u
      ${joinClauses}
      WHERE u.email = ${userEmail};
    `
  }

  public static findUserById (userId: User['id'], options: UserRepositoryOptions[]): Sql {
    const select = this.buildSelect(options)

    const joinClauses = this.buildJoin(options)

    return Prisma.sql`
      ${select}
      FROM users u
      ${joinClauses}
      WHERE u.id = ${userId};
    `
  }

  private static buildSelect (options: UserRepositoryOptions[]): Sql {
    const selects: string[] = []

    if (options.includes('verificationToken')) {
      selects.push(verificationTokenSelects)
    }

    if (options.includes('savedPosts')) {
      selects.push(savedPostsSelects)
    }

    return selects.length === 0
      ? Prisma.sql`SELECT u.*`
      : Prisma.sql`SELECT u.*, ${Prisma.raw(selects.join(', '))}`
  }

  private static buildJoin (options: UserRepositoryOptions[]): Sql {
    const joinClauses: string[] = []

    if (options.includes('verificationToken')) {
      joinClauses.push('LEFT JOIN verification_tokens AS vt ON u.email = vt.user_email')
    }

    if (options.includes('savedPosts')) {
      joinClauses.push('LEFT JOIN saved_posts AS sp ON u.id = sp.user_id')
      joinClauses.push('LEFT JOIN posts AS p ON sp.post_id = p.id')
    }

    return joinClauses.length === 0
      ? Prisma.empty
      : Prisma.raw(joinClauses.join('\n'))
  }
}
