import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class PasswordValidator implements Validator<string> {
  private passwordMinLength = 8

  public validate (password: string): string {
    if (password.length < this.passwordMinLength) {
      throw ValidationException.invalidPassword(password)
    }

    return password
  }
}
