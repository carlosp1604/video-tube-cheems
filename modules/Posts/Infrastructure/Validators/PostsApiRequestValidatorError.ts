import { ZodIssue } from 'zod'
import { ZodApiValidationError } from '../../../Exceptions/Infrastructure/ZodApiValidationError'

export class PostsApiRequestValidatorError extends ZodApiValidationError {
  public static getPostsRequestId = 'validator_exception_get_posts_request'

  public static getPostsValidation(issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.getPostsRequestId,
      issues
    )
  }
}