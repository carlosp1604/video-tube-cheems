import { ZodIssue } from 'zod'
import { ZodApiValidationError } from '../../../Exceptions/Infrastructure/ZodApiValidationError'

export class PostCommentApiRequestValidatorError extends ZodApiValidationError {
  public static createCommentRequestId = 'validator_exception_create_comment_request'
  public static updateCommentRequestId = 'validator_exception_update_comment_request'
  
  public static createPostCommentValidation(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.createCommentRequestId,
      issues
    )
  }

  public static updatePostCommentValidation(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.updateCommentRequestId,
      issues
    )
  }
}