import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_media', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.string('type', 36).notNullable()
      table.string('title', 256).notNullable()
      table.string('thumbnail_url', 512).nullable()
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_media')
}
