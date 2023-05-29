import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_reactions', (table) => {
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
      table.string('reaction_type', 16).index().notNullable()
      table.primary(['post_id', 'user_id'])
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

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_reactions')
}
