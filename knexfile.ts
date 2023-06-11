import { Knex } from 'knex'
import path from 'path'
import { getKnexConfig } from './persistence/db'
import { DatabaseConfigProvider } from '~/persistence/DatabaseConfigProvider'

const knexConfig: Knex.Config = {
  client: DatabaseConfigProvider.getInstance().getClient(),
  connection: getKnexConfig(),
  pool: {
    min: 2,
    max: 10,
  },
  seeds: {
    directory: path.join(process.cwd(), 'seeders'),
  },
  migrations: {
    directory: path.join(process.cwd(), 'migrations'),
  },
}

module.exports = knexConfig
