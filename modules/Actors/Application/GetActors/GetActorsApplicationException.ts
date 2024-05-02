import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetActorsApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_actors_invalid_per_page_value'
  public static invalidPageValueId = 'get_actors_invalid_page_value'
  public static invalidSortingOptionId = 'get_actors_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_actors_invalid_sorting_criteria'
  public static invalidFilterTypeId = 'get_actors_invalid_filter_type'
  public static invalidFilterValueId = 'get_actors_invalid_filter_value'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetActorsApplicationException.prototype)
  }

  public static invalidPerPage (minLimit: number, maxLimit: number): GetActorsApplicationException {
    return new GetActorsApplicationException(
      `perPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidPageValue (): GetActorsApplicationException {
    return new GetActorsApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
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
