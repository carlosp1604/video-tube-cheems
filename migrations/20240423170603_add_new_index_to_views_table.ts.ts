import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('views', async (table) => {
    table.index('created_at')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('views', (table) => {
    table.dropIndex('created_at')
  })
}
