import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('actors', function (table) {
      table.string('id', 36).primary().notNullable()
      table.string('name', 128).notNullable()
      table.string('description', 512)
      table.integer('views_count').notNullable().defaultTo(0)
      table.string('image_url', 256).nullable()
      table.timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable()
      table.timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable()
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('actors')
}

