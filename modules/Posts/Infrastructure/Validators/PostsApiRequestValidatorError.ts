import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class PostsApiRequestValidatorError extends ZodApiValidationException {
  public static getPostsRequestId = 'validator_exception_get_posts_request'
  public static addPostViewRequestId = 'validator_exception_add_post_view_request'
  public static addPostReactionRequestId = 'validator_exception_add_reaction_request'

  public static getPostsValidation (issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.getPostsRequestId,
      issues
    )
  }

  public static addPostViewRequest (issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.addPostViewRequestId,
      issues
    )
  }

  public static addPostReactionRequest (issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.addPostReactionRequestId,
      issues
    )
  }
}
