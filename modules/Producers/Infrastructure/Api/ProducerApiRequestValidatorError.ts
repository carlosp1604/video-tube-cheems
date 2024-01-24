import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class ProducerApiRequestValidatorError extends ZodApiValidationException {
  public static getProducersRequestId = 'validator_exception_get_producers_request'

  public static getProducersValidation (issues: ZodIssue[]): ProducerApiRequestValidatorError {
    return new ProducerApiRequestValidatorError(
      this.getProducersRequestId,
      issues
    )
  }
}
