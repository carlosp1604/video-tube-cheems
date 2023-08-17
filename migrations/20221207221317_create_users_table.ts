import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('name', 256).notNullable()
      table.string('username', 256).notNullable().unique()
      table.string('email', 256).notNullable().unique()
      table.string('image_url', 256).nullable()
      table.string('language', 16).notNullable()
      table.string('password', 60).notNullable()
      table.timestamp('email_verified').nullable()
      table.timestamps(true, true)
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
