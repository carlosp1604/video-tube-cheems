import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('views', async (table) => {
    table.index('viewable_id')
    table.index('viewable_type')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('views', (table) => {
    table.dropIndex('viewable_id')
    table.dropIndex('viewable_type')
  })
}
