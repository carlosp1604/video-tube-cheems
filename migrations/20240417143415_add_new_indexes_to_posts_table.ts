import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', async (table) => {
    table.text('description').notNullable().alter()
    table.index('description', 'posts_description_index', {
      indexType: 'FULLTEXT',
    })
    table.index('published_at')
    table.dropIndex('title')
    table.index('title', 'posts_title_index', {
      indexType: 'FULLTEXT',
    })
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', (table) => {
    table.dropIndex('title')
    table.dropIndex('published_at')
    table.index('title')
    table.dropIndex('description', 'posts_description_index')
    table.string('description', 4096).notNullable().alter()
  })
}
