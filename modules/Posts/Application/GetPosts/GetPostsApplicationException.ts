import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetPostsApplicationException extends ApplicationException {
  public static invalidLimitValueId = 'get_posts_invalid_limit_value'
  public static invalidOffsetValueId = 'get_posts_invalid_offset_value'
  public static invalidFilterTypeId = 'get_posts_invalid_filter_type'
  public static invalidFilterValueId = 'get_posts_invalid_filter_value'
  public static invalidSortingOptionId = 'get_posts_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_posts_invalid_sorting_criteria'

  public static invalidLimitValue (minLimit: number, maxLimit: number): GetPostsApplicationException {
    return new GetPostsApplicationException(
      `Limit must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidLimitValueId
    )
  }

  public static invalidOffsetValue (): GetPostsApplicationException {
    return new GetPostsApplicationException(
      'Limit must be a integer greater or equal to 0',
      this.invalidOffsetValueId
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
