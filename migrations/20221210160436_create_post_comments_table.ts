import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_comments', function (table) {
      table.string('id', 36).primary().notNullable()
      table.string('comment', 512).notNullable()
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table.string('parent_comment_id', 36)
        .references('id')
        .inTable('post_comments')
        .nullable()
        .onDelete('CASCADE')
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
  return knex.schema.dropTable('post_comments')
}

