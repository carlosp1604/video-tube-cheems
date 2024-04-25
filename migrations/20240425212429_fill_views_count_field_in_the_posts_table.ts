import { Knex } from 'knex'

/**
 * Warning: This migration cannot recovery removed data
 */
export async function up (knex: Knex): Promise<void> {
  const postIds = await knex('posts').select('id')

  for (const postId of postIds) {
    // Count post views
    const postViewsCount = await knex('views')
      .count('id as count')
      .where('viewable_id', '=', postId.id)
      .andWhere('viewable_type', '=', 'Post')

    // Set count to new field (views_count)
    await knex('posts')
      .update({ views_count: postViewsCount[0].count })
      .where('id', '=', postId.id)

    // Remove views where user_id = null and viewable_type = Post
    await knex('views')
      .del()
      .whereNull('user_id')
      .andWhere('viewable_type', '=', 'Post')
  }
}

export async function down (knex: Knex): Promise<void> {
  await knex('posts')
    .update({ views_count: 0 })
}
