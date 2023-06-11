import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_views', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .nullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_views')
}
