import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('reports', (table) => {
      table.string('content', 1024).notNullable()
      table.string('type', 16).notNullable()
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
      table.timestamps(true, true)
      table.primary(['user_id', 'post_id', 'type'])
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('reports')
}
