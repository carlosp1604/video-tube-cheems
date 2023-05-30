import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class EmailValidator implements Validator<string> {
  private emailFormat = /^[^@\s]+@[^@\s]+\.[^@\s]{2,63}$/

  public validate (email: string): string {
    if (email.match(this.emailFormat) === null) {
      throw ValidationException.invalidEmail(email)
    }

    return email
  }
}
