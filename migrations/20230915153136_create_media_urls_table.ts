import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('media_urls', (table) => {
      table.string('media_provider_id', 36)
        .references('id')
        .inTable('media_providers')
        .notNullable()
        .onDelete('CASCADE')
      table.string('post_media_id', 36)
        .references('id')
        .inTable('post_media')
        .notNullable()
        .onDelete('CASCADE')
      table.string('url', 512).notNullable()
      table.string('title', 256).notNullable()
      table.string('download_url', 512).nullable()
      table.primary(['url', 'post_media_id'])
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('media_urls')
}
