import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('translations', (table) => {
      table.string('translatable_id', 36).notNullable()
      table.string('translatable_type', 36).notNullable()
      table.string('field', 256).notNullable()
      table.string('value', 2048).notNullable()
      table.string('language', 4).notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

      table.primary(['translatable_id', 'field', 'translatable_type', 'language'])
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('translations')
}
