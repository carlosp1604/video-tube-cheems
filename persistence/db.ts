import { Knex } from 'knex'
import { DatabaseConfigProvider } from './DatabaseConfigProvider'

export function getKnexConfig (): Knex.MySqlConnectionConfig {
  const mysqlConfigProvider = DatabaseConfigProvider.getInstance()

  return {
    host: mysqlConfigProvider.getHost(),
    database: mysqlConfigProvider.getDatabase(),
    port: mysqlConfigProvider.getPort(),
    user: mysqlConfigProvider.getUser(),
    password: mysqlConfigProvider.getPassword(),
  }
}
