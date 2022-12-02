import { Knex } from 'knex'
import * as dotenv from 'dotenv'

dotenv.config()

export function getKnexConfig(): Knex.MySqlConnectionConfig {
  const { env } = process
  const host = env.MYSQL_HOST
  const database = env.MYSQL_DATABASE
  const port = env.MYSQL_PORT
  const user = env.MYSQL_USER
  const password = env.MYSQL_PASSWORD

  if (
    !host ||
    !database ||
    !port ||
    !user ||
    !password
  ) {
    console.log(host)
    throw Error('Cannot connect to database. Missing .env vars.')
  }

  if (isNaN(parseInt(port))) {
    throw Error('Database port must be an integer.')
  }

  return {
    host,
    database,
    port: parseInt(port),
    user,
    password
  }
}