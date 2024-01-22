import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetProducersApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_producers_invalid_per_page_value'
  public static invalidPageValueId = 'get_producers_invalid_page_value'
  public static invalidSortingOptionId = 'get_producers_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_producers_invalid_sorting_criteria'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetProducersApplicationException.prototype)
  }

  public static invalidPerPage (minLimit: number, maxLimit: number): GetProducersApplicationException {
    return new GetProducersApplicationException(
      `perPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidPageValue (): GetProducersApplicationException {
    return new GetProducersApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
    )
  }

  public static invalidSortingOption (sortingOption: string): GetProducersApplicationException {
    return new GetProducersApplicationException(
      `Sorting option ${sortingOption} is not a valid sorting option`,
      this.invalidSortingOptionId
    )
  }

  public static invalidSortingCriteria (sortingCriteria: string): GetProducersApplicationException {
    return new GetProducersApplicationException(
      `Sorting criteria ${sortingCriteria} is not a valid sorting criteria`,
      this.invalidSortingCriteriaId
    )
  }
}
