import { ZodIssue } from 'zod'
import { ZodApiValidationError } from '../../../Exceptions/Infrastructure/ZodApiValidationError'
import { ValidationErrorItem } from '../../../Exceptions/Infrastructure/ValidationErrorItem'

export class CreatePostCommentApiRequestValidatorError extends ZodApiValidationError {
  public static createCommentRequestId = 'validator_exception_create_comment_request'
  public exceptions: ValidationErrorItem[]

  // TODO: Fix this
  constructor(issues: ZodIssue[]) {
    super(CreatePostCommentApiRequestValidatorError.createCommentRequestId, issues)
  }
}