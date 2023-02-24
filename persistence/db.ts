import { Knex } from 'knex'
import { MysqlConfigProvider } from './MysqlConfigProvider'

export function getKnexConfig(): Knex.MySqlConnectionConfig {
  const mysqlConfigProvider = MysqlConfigProvider.getInstance()
  
  return {
    host: mysqlConfigProvider.getHost(),
    database: mysqlConfigProvider.getDatabase(),
    port: mysqlConfigProvider.getPort(),
    user: mysqlConfigProvider.getUser(),
    password: mysqlConfigProvider.getPassword()
  }
}