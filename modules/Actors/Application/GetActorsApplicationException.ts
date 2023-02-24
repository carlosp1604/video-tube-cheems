import { ApplicationException } from '../../Exceptions/Application/ApplicationException'

export class GetActorsApplicationException extends ApplicationException {
  public static invalidLimitValueId = 'get_actors_invalid_limit_value'
  public static invalidOffsetValueId = 'get_actors_invalid_offset_value'
  public static invalidFilterValueId = 'get_actors_invalid_filter_value'


  public static invalidLimitValue(minLimit: number, maxLimit: number): GetActorsApplicationException {
    return new GetActorsApplicationException(
      `Limit must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidLimitValueId
    )
  }

  public static invalidOffsetValue(): GetActorsApplicationException {
    return new GetActorsApplicationException(
      'Limit must be a integer greater or equal to 0',
      this.invalidLimitValueId
    )
  }

  public static invalidFilterValue(): GetActorsApplicationException {
    return new GetActorsApplicationException(
      'Filter must be a not empty string and must not include special characters',
      this.invalidLimitValueId
    )
  }
}