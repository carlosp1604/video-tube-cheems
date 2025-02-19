import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class ReportsApiRequestValidatorError extends ZodApiValidationException {
  public static createReportRequestId = 'validator_exception_create_report'

  public static createReportValidation (issues: ZodIssue[]): ReportsApiRequestValidatorError {
    return new ReportsApiRequestValidatorError(
      this.createReportRequestId,
      issues
    )
  }
}
