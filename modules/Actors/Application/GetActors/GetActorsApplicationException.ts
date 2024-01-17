import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetActorsApplicationException extends ApplicationException {
  public static invalidLimitValueId = 'get_actors_invalid_limit_value'
  public static invalidOffsetValueId = 'get_actors_invalid_offset_value'
  public static invalidSortingOptionId = 'get_actors_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_actors_invalid_sorting_criteria'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetActorsApplicationException.prototype)
  }

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
