import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('views', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('viewable_id', 36).notNullable()
      table.string('viewable_type', 36).notNullable()
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .nullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('views')
}
