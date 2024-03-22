import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('accounts', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('type', 256).notNullable()
      table.string('provider', 256).notNullable()
      table.string('provider_account_id', 256).notNullable()
      table.text('refresh_token').nullable().defaultTo(null)
      table.text('access_token').nullable().defaultTo(null)
      table.integer('expires_at').nullable().defaultTo(null)
      table.string('token_type', 256).nullable().defaultTo(null)
      table.string('scope', 256).nullable().defaultTo(null)
      table.text('id_token').nullable().defaultTo(null)
      table.string('session_state', 256).nullable().defaultTo(null)
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
