import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class UsernameValidator implements Validator<string> {
  private usernameFormat = /^[a-zA-Z0-9_]+$/

  public validate (username: string): string {
    if (username.match(this.usernameFormat) === null) {
      throw ValidationException.invalidUsername(username)
    }

    return username
  }
}
