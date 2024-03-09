import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('posts', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('title', 256).notNullable().index()
      table.string('description', 4096).notNullable()
      table.string('slug', 128).unique().notNullable()
      table.string('type', 36).notNullable()
      table.string('producer_id', 36)
        .references('id')
        .inTable('producers')
        .nullable()
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.string('actor_id', 36)
        .references('id')
        .inTable('actors')
        .nullable()
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.timestamp('published_at')
        .defaultTo(null)
      table.timestamps(true, true)
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts')
}
