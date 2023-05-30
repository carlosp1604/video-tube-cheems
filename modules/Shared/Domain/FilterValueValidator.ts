import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class FilterValueValidator implements Validator<string> {
  public validate (value: string): string {
    if (value === '') {
      throw ValidationException.invalidFilterValue(value)
    }

    return value
  }
}
