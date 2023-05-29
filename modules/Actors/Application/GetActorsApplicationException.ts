import { ApplicationException } from '../../Exceptions/Application/ApplicationException'

export class GetActorsApplicationException extends ApplicationException {
  public static invalidLimitValueId = 'get_posts_invalid_limit_value'
  public static invalidOffsetValueId = 'get_posts_invalid_offset_value'
  public static invalidFilterTypeId = 'get_posts_invalid_filter_type'
  public static invalidFilterValueId = 'get_posts_invalid_filter_value'
  public static invalidSortingOptionId = 'get_posts_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_posts_invalid_sorting_criteria'

  public static invalidLimitValue (minLimit: number, maxLimit: number): GetActorsApplicationException {
    return new GetActorsApplicationException(
      `Limit must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidLimitValueId
    )
  }

  public static invalidOffsetValue (): GetActorsApplicationException {
    return new GetActorsApplicationException(
      'Limit must be a integer greater or equal to 0',
      this.invalidOffsetValueId
    )
  }

  public static invalidFilterType (filter: string): GetActorsApplicationException {
    return new GetActorsApplicationException(
      `Filter ${filter} is not a valid filter`,
      this.invalidFilterTypeId
    )
  }

  public static invalidFilterValue (): GetActorsApplicationException {
    return new GetActorsApplicationException(
      'Filter must be a not empty string and must not include special characters',
      this.invalidFilterValueId
    )
  }

  public static invalidSortingOption (sortingOption: string): GetActorsApplicationException {
    return new GetActorsApplicationException(
      `Sorting option ${sortingOption} is not a valid sorting option`,
      this.invalidSortingOptionId
    )
  }

  public static invalidSortingCriteria (sortingCriteria: string): GetActorsApplicationException {
    return new GetActorsApplicationException(
      `Sorting criteria ${sortingCriteria} is not a valid sorting criteria`,
      this.invalidSortingCriteriaId
    )
  }
}
