import { Knex } from 'knex'

/**
 * Warning: This migration cannot recovery removed data
 */
export async function up (knex: Knex): Promise<void> {
  const actorsIds = await knex('actors').select('id')

  for (const actorId of actorsIds) {
    // Count producer views
    const actorViewsCount = await knex('views')
      .count('id as count')
      .where('viewable_id', '=', actorId.id)
      .andWhere('viewable_type', '=', 'Actor')

    // Set count to new field (views_count)
    await knex('actors')
      .update({ views_count: actorViewsCount[0].count })
      .where('id', '=', actorId.id)

    // Remove views where viewable_id = actorId and viewable_type = Actor
    await knex('views')
      .del()
      .where('viewable_id', '=', actorId.id)
      .andWhere('viewable_type', '=', 'Actor')
  }
}

export async function down (knex: Knex): Promise<void> {
  await knex('actors')
    .update({ views_count: 0 })
}
