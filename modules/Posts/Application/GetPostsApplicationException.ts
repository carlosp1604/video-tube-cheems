import { ApplicationException } from '../../Exceptions/Application/ApplicationException'

export class GetPostsApplicationException extends ApplicationException {
  public static invalidLimitValueId = 'get_posts_invalid_limit_value'
  public static invalidOffsetValueId = 'get_posts_invalid_offset_value'
  public static invalidFilterValueId = 'get_posts_invalid_filter_value'


  public static invalidLimitValue(minLimit: number, maxLimit: number): GetPostsApplicationException {
    return new GetPostsApplicationException(
      `Limit must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidLimitValueId
    )
  }

  public static invalidOffsetValue(): GetPostsApplicationException {
    return new GetPostsApplicationException(
      'Limit must be a integer greater or equal to 0',
      this.invalidLimitValueId
    )
  }

  public static invalidFilterValue(): GetPostsApplicationException {
    return new GetPostsApplicationException(
      'Filter must be a not empty string and must not include special characters',
      this.invalidLimitValueId
    )
  }
}