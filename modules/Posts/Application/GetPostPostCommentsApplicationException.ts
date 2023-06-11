import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetPostPostCommentsApplicationException extends ApplicationException {
  public static invalidLimitValueId = 'get_post_post_comments_invalid_limit_value'
  public static invalidOffsetValueId = 'get_post_post_comments_invalid_offset_value'

  public static invalidLimitValue (
    minLimit: number,
    maxLimit: number
  ): GetPostPostCommentsApplicationException {
    return new GetPostPostCommentsApplicationException(
      `Limit must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidLimitValueId
    )
  }

  public static invalidOffsetValue (): GetPostPostCommentsApplicationException {
    return new GetPostPostCommentsApplicationException(
      'Limit must be a integer greater or equal to 0',
      this.invalidLimitValueId
    )
  }
}
