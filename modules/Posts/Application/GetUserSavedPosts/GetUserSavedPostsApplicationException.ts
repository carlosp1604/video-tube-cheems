import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetUserSavedPostsApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_user_saved_posts_invalid_per_page_value'
  public static invalidPageValueId = 'get_user_saved_posts_invalid_page_value'
  public static invalidFilterTypeId = 'get_user_saved_posts_invalid_filter_type'
  public static invalidFilterValueId = 'get_user_saved_posts_invalid_filter_value'
  public static invalidSortingOptionId = 'get_user_saved_posts_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_user_saved_posts_invalid_sorting_criteria'
  public static savedByFilterMissingId = 'get_user_saved_posts_saved_by_filter_missing'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetUserSavedPostsApplicationException.prototype)
  }

  public static invalidPerPageValue (minLimit: number, maxLimit: number): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      `PerPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidPageValue (): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
    )
  }

  public static invalidFilterType (filter: string): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      `Filter ${filter} is not a valid filter`,
      this.invalidFilterTypeId
    )
  }

  public static invalidFilterValue (): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      'Filter must be a not empty string and must not include special characters',
      this.invalidFilterValueId
    )
  }

  public static invalidSortingOption (sortingOption: string): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      `Sorting option ${sortingOption} is not a valid sorting option`,
      this.invalidSortingOptionId
    )
  }

  public static invalidSortingCriteria (sortingCriteria: string): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      `Sorting criteria ${sortingCriteria} is not a valid sorting criteria`,
      this.invalidSortingCriteriaId
    )
  }

  public static savedByIdFilterMissing (): GetUserSavedPostsApplicationException {
    return new GetUserSavedPostsApplicationException(
      "You must provide a userId in the savedBy filter to get the user's saved post",
      this.savedByFilterMissingId
    )
  }
}
