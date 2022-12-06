import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_post_tags', function (table) {
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
      table.string('post_tag_id', 36)
        .references('id')
        .inTable('post_tags')
        .notNullable()
      table.primary(['post_id', 'post_tag_id'])
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
  return knex.schema.dropTable('post_post_tags')
}

