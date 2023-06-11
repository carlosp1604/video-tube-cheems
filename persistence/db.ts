import { Knex } from 'knex'
import { DatabaseConfigProvider } from './DatabaseConfigProvider'

export function getKnexConfig (): Knex.MySqlConnectionConfig {
  const databaseConfigProvider = DatabaseConfigProvider.getInstance()

  return {
    host: databaseConfigProvider.getHost(),
    database: databaseConfigProvider.getDatabase(),
    port: databaseConfigProvider.getPort(),
    user: databaseConfigProvider.getUser(),
    password: databaseConfigProvider.getPassword(),
  }
}
