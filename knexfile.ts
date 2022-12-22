import { Knex } from 'knex'
import path from 'path'
import { getKnexConfig } from './persistence/db'

const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: getKnexConfig(),
  pool: {
    min: 2,
    max: 10,
  },
  seeds: {
    directory: path.join(process.cwd(), 'seeders')
  },
  migrations: {
    directory: path.join(process.cwd(), 'migrations'),
  },
}

module.exports = knexConfig