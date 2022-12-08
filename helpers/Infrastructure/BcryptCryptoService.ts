import { CryptoServiceInterface } from '../Domain/CryptoServiceInterface'
import { hash, compare, genSaltSync } from 'bcrypt'

export class BcryptCryptoService implements CryptoServiceInterface {
  // TODO: Take salt rounds from .env file
  private saltRounds = 10
  public async hash(password: string): Promise<string> {
    // TODO: handle possible errors
    const salt = genSaltSync(this.saltRounds)
    return hash(password, salt)
  }

  public async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }

}