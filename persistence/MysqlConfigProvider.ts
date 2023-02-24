import * as dotenv from 'dotenv'

dotenv.config()

const { env } = process

export class MysqlConfigProvider {
  private static instance: MysqlConfigProvider

  private constructor() {}

  public static getInstance(): MysqlConfigProvider {
    if (!MysqlConfigProvider.instance) {
      MysqlConfigProvider.instance = new MysqlConfigProvider()
    }

    return MysqlConfigProvider.instance
  }

  public getHost(): string {
    return this.parsetHost()
  }

  public getDatabase(): string {
    return this.parseDatabase()
  }

  public getPort(): number {
    return this.parsePort()
  }

  public getUser(): string {
    return this.parseUser()
  }

  public getPassword(): string {
    return this.parsePassword()
  }

  private parsetHost(): string {
    const host = env.MYSQL_HOST

    if (!host) {
      throw Error('Missing MYSQL_HOST env var.')
    }

    return host
  }

  private parseDatabase(): string {
    const database = env.MYSQL_DATABASE

    if (!database) {
      throw Error('Missing MYSQL_DATABASE env var.')
    }

    return database
  }

  private parsePort(): number {
    const port = env.MYSQL_PORT

    if (!port) {
      throw Error('Missing MYSQL_PORT env var.')
    }

    if (isNaN(parseInt(port))) {
      throw Error('MYSQL_PORT must be an integer.')
    }

    return parseInt(port)
  }

  private parseUser(): string {
    const user = env.MYSQL_USER

    if (!user) {
      throw Error('Missing MYSQL_USER env var.')
    }

    return user
  }

  private parsePassword(): string {
    const password = env.MYSQL_PASSWORD

    if (!password) {
      throw Error('Missing MYSQL_PASSWORD env var.')
    }

    return password
  }
}