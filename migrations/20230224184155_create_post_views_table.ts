import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_views', function (table) {
      table.string('id', 36).primary().notNullable()
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .notNullable()
      table.string('ip_address', 16).notNullable()
      table.timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable()
      table.timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_views')
}

