import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetPostsApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_posts_invalid_per_page_value'
  public static invalidPageValueId = 'get_posts_invalid_page_value'
  public static invalidFilterTypeId = 'get_posts_invalid_filter_type'
  public static invalidFilterValueId = 'get_posts_invalid_filter_value'
  public static invalidSortingOptionId = 'get_posts_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_posts_invalid_sorting_criteria'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetPostsApplicationException.prototype)
  }

  public static invalidPerPageValue (minLimit: number, maxLimit: number): GetPostsApplicationException {
    return new GetPostsApplicationException(
      `PerPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidPageValue (): GetPostsApplicationException {
    return new GetPostsApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
    )
  }

  public static invalidFilterType (filter: string): GetPostsApplicationException {
    return new GetPostsApplicationException(
      `Filter ${filter} is not a valid filter`,
      this.invalidFilterTypeId
    )
  }

  public static invalidFilterValue (): GetPostsApplicationException {
    return new GetPostsApplicationException(
      'Filter must be a not empty string and must not include special characters',
      this.invalidFilterValueId
    )
  }

  public static invalidSortingOption (sortingOption: string): GetPostsApplicationException {
    return new GetPostsApplicationException(
      `Sorting option ${sortingOption} is not a valid sorting option`,
      this.invalidSortingOptionId
    )
  }

  public static invalidSortingCriteria (sortingCriteria: string): GetPostsApplicationException {
    return new GetPostsApplicationException(
      `Sorting criteria ${sortingCriteria} is not a valid sorting criteria`,
      this.invalidSortingCriteriaId
    )
  }
}
