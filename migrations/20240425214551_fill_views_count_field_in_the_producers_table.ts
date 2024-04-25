import { Knex } from 'knex'

/**
 * Warning: This migration cannot recovery removed data
 */
export async function up (knex: Knex): Promise<void> {
  const producerIds = await knex('producers').select('id')

  for (const producerId of producerIds) {
    // Count producer views
    const producerViewsCount = await knex('views')
      .count('id as count')
      .where('viewable_id', '=', producerId.id)
      .andWhere('viewable_type', '=', 'Producer')

    // Set count to new field (views_count)
    await knex('producers')
      .update({ views_count: producerViewsCount[0].count })
      .where('id', '=', producerId.id)

    // Remove views where viewable_id = producerId and viewable_type = Producer
    await knex('views')
      .del()
      .where('viewable_id', '=', producerId.id)
      .andWhere('viewable_type', '=', 'Producer')
  }
}

export async function down (knex: Knex): Promise<void> {
  await knex('producers')
    .update({ views_count: 0 })
}
