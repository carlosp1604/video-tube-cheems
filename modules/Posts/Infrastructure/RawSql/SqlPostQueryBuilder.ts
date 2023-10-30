import { Sql } from 'prisma/prisma-client/runtime/library'
import { Prisma } from '.prisma/client'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'

// eslint-disable-next-line max-len
const producerSelects = 'pd.id AS producer_id, pd.name AS producer_name, pd.description AS producer_description, pd.parent_producer_id AS producer_parent_producer_id, pd.image_url AS producer_image_url, pd.brand_hex_color AS producer_brand_hex_color, pd.created_at AS producer_created_at, pd.updated_at AS producer_updated_at, pd.deleted_at AS producer_deleted_at'
// eslint-disable-next-line max-len
const postMetaSelects = 'pm.type AS meta_type, pm.value AS meta_value, pm.post_id AS meta_post_id, pm.created_at AS meta_created_at, pm.updated_at AS meta_updated_at, pm.deleted_at AS meta_deleted_at'
// eslint-disable-next-line max-len
const actorSelects = 'a.id AS actor_id, a.name AS actor_name, a.description AS actor_description, a.image_url AS actor_image_url, a.created_at AS actor_created_at, a.updated_at AS actor_updated_at, a.deleted_at AS actor_deleted_at'
// eslint-disable-next-line max-len
const translationSelects = 't.translatable_id AS translation_translatable_id, t.field AS translation_field, t.value AS translation_value, t.translatable_type AS translation_translatable_type, t.language AS translation_language, t.created_at AS translation_created_at, t.updated_at AS translation_updated_at'

export class SqlPostQueryBuilder {
  public static findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Sql {
    const options: RepositoryOptions[] = ['meta', 'actor', 'producer', 'translations']
    const select = this.buildSelect(options)

    const joinClauses = this.buildJoin(options)

    let countViewsJoin: Sql | null = null

    if (sortingOption === 'views') {
      countViewsJoin = Prisma.sql`
        JOIN (SELECT post_id AS view_post_id, COUNT(*) AS post_views_count
              FROM post_views pv
              GROUP BY view_post_id
              ) views_count ON (views_count.view_post_id = p.id)`
    }

    return Prisma.sql`
      ${select}
      FROM posts p
      ${joinClauses}
      ${countViewsJoin !== null ? countViewsJoin : Prisma.empty}
      WHERE p.id IN ( 
        SELECT id
        FROM posts
        WHERE published_at IS NOT NULL
        AND deleted_at IS NULL
        ${countViewsJoin === null
          ? Prisma.raw(`ORDER BY published_at ${sortingCriteria}`)
          : Prisma.raw(`ORDER BY post_views_count ${sortingCriteria}`)
        }
        LIMIT ${limit}
        OFFSET ${offset}
      )
      ${countViewsJoin === null
      ? Prisma.raw(`ORDER BY p.published_at ${sortingCriteria}`)
      : Prisma.raw(`ORDER BY post_views_count ${sortingCriteria}`)
      }
    `
  }

  private static buildSelect (options: RepositoryOptions[]): Sql {
    const selects: string[] = []

    if (options.includes('meta')) {
      selects.push(postMetaSelects)
    }

    if (options.includes('actor')) {
      selects.push(actorSelects)
    }

    if (options.includes('producer')) {
      selects.push(producerSelects)
    }

    if (options.includes('translations')) {
      selects.push(translationSelects)
    }

    return selects.length === 0
      ? Prisma.sql`SELECT p.*`
      : Prisma.sql`SELECT p.*, ${Prisma.raw(selects.join(', '))}`
  }

  private static buildJoin (options: RepositoryOptions[]): Sql {
    const joinClauses: string[] = []

    if (options.includes('meta')) {
      joinClauses.push('LEFT JOIN posts_meta AS pm ON p.id = pm.post_id')
    }

    if (options.includes('producer')) {
      joinClauses.push('LEFT JOIN producers AS pd ON p.producer_id = pd.id')
    }

    if (options.includes('actor')) {
      joinClauses.push('LEFT JOIN actors AS a ON p.actor_id = a.id')
    }

    if (options.includes('translations')) {
      joinClauses.push('LEFT JOIN translations AS t ON p.id = t.translatable_id')
    }

    return joinClauses.length === 0
      ? Prisma.empty
      : Prisma.raw(joinClauses.join('\n'))
  }
}
