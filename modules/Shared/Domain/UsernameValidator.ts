import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class UsernameValidator implements Validator<string> {
  private usernameFormat = /^[a-zA-Z0-9_]+$/
  private usernameMinLength = 4
  private usernameMaxLength = 256

  public validate (username: string): string {
    if (
      username.match(this.usernameFormat) === null ||
      username.length < this.usernameMinLength ||
      username.length > this.usernameMaxLength
    ) {
      throw ValidationException.invalidUsername(username)
    }

    return username
  }
}
