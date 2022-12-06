import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('posts', function (table) {
      table.string('id', 36).primary().notNullable()
      table.string('title', 256).notNullable()
      table.string('description', 4096).notNullable()
      table.integer('views_count').notNullable().defaultTo(0)
      table.timestamp('published_at')
        .defaultTo(null)
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
  return knex.schema.dropTable('posts')
}

