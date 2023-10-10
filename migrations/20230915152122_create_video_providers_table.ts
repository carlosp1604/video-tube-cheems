import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('video_providers', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('name', 128).notNullable().index()
      table.string('logo_url', 256).nullable()
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('video_providers')
}
