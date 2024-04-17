import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('reactions', async (table) => {
    table.index('reactionable_id')
    table.index('reactionable_type')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('reactions', (table) => {
    table.dropIndex('reactionable_id')
    table.dropIndex('reactionable_type')
  })
}
