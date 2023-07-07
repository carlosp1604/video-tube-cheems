import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetPostPostChildCommentsApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_post_post_child_comments_invalid_per_page_value'
  public static invalidPageValueId = 'get_post_post_child_comments_invalid_page_value'

  public static invalidPerPageValue (
    minLimit: number,
    maxLimit: number
  ): GetPostPostChildCommentsApplicationException {
    return new GetPostPostChildCommentsApplicationException(
      `PerPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidPageValue (): GetPostPostChildCommentsApplicationException {
    return new GetPostPostChildCommentsApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
    )
  }
}
