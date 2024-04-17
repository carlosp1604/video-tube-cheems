import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('translations', async (table) => {
    table.text('value').notNullable().alter()
    table.index('translatable_id')
    table.index('translatable_type')
    table.index('value', 'translations_value_index', {
      indexType: 'FULLTEXT',
    })
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('translations', (table) => {
    table.dropIndex('value', 'translations_value_index')
    table.dropIndex('translatable_id')
    table.dropIndex('translatable_type')
    table.string('value', 2048).notNullable().alter()
  })
}
