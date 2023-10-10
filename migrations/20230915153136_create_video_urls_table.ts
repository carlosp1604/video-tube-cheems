import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('video_urls', (table) => {
      table.string('type', 36).notNullable()
      table.string('provider_id', 36)
        .references('id')
        .inTable('video_providers')
        .notNullable()
        .onDelete('CASCADE')
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.string('url', 256)
      table.primary(['type', 'provider_id', 'post_id'])
      table.timestamps(true, true)
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('video_urls')
}
