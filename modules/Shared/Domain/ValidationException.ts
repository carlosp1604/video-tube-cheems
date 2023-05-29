import { DomainException } from '~/modules/Exceptions/Domain/DomainException'

export class ValidationException extends DomainException {
  public static invalidEmailId = 'validate_email_invalid_email'
  public static invalidUsernameId = 'validate_username_invalid_username'
  public static invalidFilterTypeId = 'valida_filter_invalid_filter_type'
  public static invalidFilterValueId = 'valida_filter_invalid_filter_value'
  public static invalidSortingCriteriaId = 'valida_filter_invalid_sorting_criteria'
  public static invalidSortingOptionId = 'valida_filter_invalid_sorting_option'

  public static invalidEmail (value: string): ValidationException {
    return new ValidationException(`Invalid email: ${value}`, this.invalidEmailId)
  }

  public static invalidUsername (value: string): ValidationException {
    return new ValidationException(`Invalid username: ${value}`, this.invalidUsernameId)
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
