import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('accounts', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('provider_type', 256).notNullable()
      table.string('provider_id', 256).notNullable()
      table.string('provider_account_id', 256).notNullable()
      table.string('refresh_token', 256).nullable().defaultTo(null)
      table.string('access_token', 256).nullable().defaultTo(null)
      table.string('access_token_expires', 256).nullable().defaultTo(null)
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .notNullable()
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts')
}
