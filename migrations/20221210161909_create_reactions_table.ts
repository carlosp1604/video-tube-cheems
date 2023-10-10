import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('reactions', (table) => {
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table.string('reaction_type', 16).index().notNullable()
      table.string('reactionable_id', 36).notNullable()
      table.string('reactionable_type', 36).notNullable()
      table.timestamps(true, true)
      table.timestamp('deleted_at')
        .defaultTo(null)

      table.primary(['reactionable_type', 'reactionable_id', 'user_id'])
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('reactions')
}
