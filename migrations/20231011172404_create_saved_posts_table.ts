import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('saved_posts', (table) => {
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
      table.primary(['post_id', 'user_id'])
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('saved_posts')
}
