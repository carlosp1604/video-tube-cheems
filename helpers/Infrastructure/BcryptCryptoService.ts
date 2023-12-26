import { hash, compare, genSaltSync } from 'bcrypt'
import * as crypto from 'crypto'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'

export class BcryptCryptoService implements CryptoServiceInterface {
  // TODO: Take salt rounds from .env file
  private saltRounds = 10
  public async hash (password: string): Promise<string> {
    // TODO: handle possible errors
    const salt = genSaltSync(this.saltRounds)

    return hash(password, salt)
  }

  public async compare (password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }

  public async randomHash (): Promise<string> {
    const randomString = crypto.randomBytes(36).toString()
    const salt = genSaltSync(this.saltRounds)

    return hash(randomString, salt)
  }

  public randomString (): string {
    const allowedCharacters = '0123456789'
    const defaultLength = 8
    let result = ''

    for (let i = defaultLength; i > 0; --i) {
      result += allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)]
    }

    return result
  }
}
