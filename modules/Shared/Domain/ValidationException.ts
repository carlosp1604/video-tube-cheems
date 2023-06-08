import { DomainException } from '~/modules/Exceptions/Domain/DomainException'

export class ValidationException extends DomainException {
  public static invalidEmailId = 'validate_email_invalid_email'
  public static invalidUsernameId = 'validate_username_invalid_username'
  public static invalidNameId = 'validate_name_invalid_name'
  public static invalidFilterTypeId = 'validate_filter_invalid_filter_type'
  public static invalidFilterValueId = 'validate_filter_invalid_filter_value'
  public static invalidSortingCriteriaId = 'validate_filter_invalid_sorting_criteria'
  public static invalidSortingOptionId = 'validate_filter_invalid_sorting_option'
  public static invalidPasswordId = 'validate_password_invalid_password'

  public static invalidEmail (value: string): ValidationException {
    return new ValidationException(`Invalid email: ${value}`, this.invalidEmailId)
  }

  public static invalidUsername (value: string): ValidationException {
    return new ValidationException(`Invalid username: ${value}`, this.invalidUsernameId)
  }

  public static invalidName (value: string): ValidationException {
    return new ValidationException(`Invalid name: ${value}`, this.invalidNameId)
  }

  public static invalidPassword (value: string): ValidationException {
    return new ValidationException(`Invalid password: ${value}`, this.invalidPasswordId)
  }

  public static invalidFilterType (value: string): ValidationException {
    return new ValidationException(`Invalid filter type: ${value}`, this.invalidFilterTypeId)
  }

  public static invalidFilterValue (value: string): ValidationException {
    return new ValidationException(`Invalid filter value: ${value}`, this.invalidFilterTypeId)
  }

  public static invalidSortingCriteria (value: string): ValidationException {
    return new ValidationException(`Invalid sorting criteria: ${value}`, this.invalidSortingCriteriaId)
  }

  public static invalidSortingOption (value: string): ValidationException {
    return new ValidationException(`Invalid sorting option: ${value}`, this.invalidSortingOptionId)
  }
}
