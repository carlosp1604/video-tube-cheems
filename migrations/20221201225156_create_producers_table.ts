import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
  .createTable('producers', function (table) {
    table.string('id', 36).primary().notNullable()
    table.string('name', 64).notNullable()
    table.string('parent_producer_id', 36)
      .references('id')
      .inTable('producers')
      .nullable()
      .onDelete('CASCADE')
    table.string('brand_hex_color', 9).notNullable()
    table.string('description', 4096).nullable()
    table.string('image_url', 256).nullable()
    table.timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable()
    table.timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      .notNullable()
    table.timestamp('deleted_at')
      .defaultTo(null)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('producers')
}

