import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('popular_posts', (table) => {
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('today_views').notNullable().defaultTo(0)
      table.integer('week_views').notNullable().defaultTo(0)
      table.integer('month_views').notNullable().defaultTo(0)
      table.index(['today_views'])
      table.index(['week_views'])
      table.index(['month_views'])
      table.primary(['post_id'])
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('popular_posts')
}
