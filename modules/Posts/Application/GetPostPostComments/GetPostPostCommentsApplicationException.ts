import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetPostPostCommentsApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_post_post_comments_invalid_per_page_value'
  public static invalidPageValueId = 'get_post_post_comments_invalid_page_value'

  public static invalidLimitValue (
    minLimit: number,
    maxLimit: number
  ): GetPostPostCommentsApplicationException {
    return new GetPostPostCommentsApplicationException(
      `PerPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidOffsetValue (): GetPostPostCommentsApplicationException {
    return new GetPostPostCommentsApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
    )
  }
}
