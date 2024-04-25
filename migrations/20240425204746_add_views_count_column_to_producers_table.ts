import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('producers', async (table) => {
    table.bigint('views_count').notNullable().index().notNullable().defaultTo(0)
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('producers', (table) => {
    table.dropColumn('views_count')
  })
}
