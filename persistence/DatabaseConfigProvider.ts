import * as dotenv from 'dotenv'

dotenv.config()

const { env } = process

export class DatabaseConfigProvider {
  private static instance: DatabaseConfigProvider

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor () {}

  public static getInstance (): DatabaseConfigProvider {
    if (!DatabaseConfigProvider.instance) {
      DatabaseConfigProvider.instance = new DatabaseConfigProvider()
    }

    return DatabaseConfigProvider.instance
  }

  public getHost (): string {
    return this.parsetHost()
  }

  public getDatabase (): string {
    return this.parseDatabase()
  }

  public getPort (): number {
    return this.parsePort()
  }

  public getUser (): string {
    return this.parseUser()
  }

  public getPassword (): string {
    return this.parsePassword()
  }

  private parsetHost (): string {
    const host = env.DATABASE_HOST

    if (!host) {
      throw Error('Missing DATABASE_HOST env var.')
    }

    return host
  }

  private parseDatabase (): string {
    const database = env.DATABASE_DATABASE

    if (!database) {
      throw Error('Missing DATABASE_DATABASE env var.')
    }

    return database
  }

  private parsePort (): number {
    const port = env.DATABASE_PORT

    if (!port) {
      throw Error('Missing DATABASE_PORT env var.')
    }

    if (isNaN(parseInt(port))) {
      throw Error('DATABASE_PORT must be an integer.')
    }

    return parseInt(port)
  }

  private parseUser (): string {
    const user = env.DATABASE_USER

    if (!user) {
      throw Error('Missing DATABASE_USER env var.')
    }

    return user
  }

  private parsePassword (): string {
    const password = env.DATABASE_PASSWORD

    if (!password) {
      throw Error('Missing DATABASE_PASSWORD env var.')
    }

    return password
  }
}
