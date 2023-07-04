import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .table('posts', (table) => {
      table.string('slug', 128).unique().notNullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.table('posts', (table) => {
    table.dropColumn('slug')
  })
}
