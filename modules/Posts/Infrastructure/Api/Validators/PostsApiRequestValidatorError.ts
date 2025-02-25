import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class PostsApiRequestValidatorError extends ZodApiValidationException {
  public static getPostsRequestId = 'validator_exception_get_posts_request'
  public static addPostViewRequestId = 'validator_exception_add_post_view_request'
  public static addPostReactionRequestId = 'validator_exception_add_reaction_request'
  public static deletePostReactionRequestId = 'validator_exception_delete_post_reaction_request'
  public static getPostUserInteractionRequestId = 'validator_get_post_user_interaction_request'
  public static getPostReactionsCountRequestId = 'validator_get_post_reactions_count_request'

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

  public static deletePostReactionRequest (issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.deletePostReactionRequestId,
      issues
    )
  }

  public static getPostUserInteractionRequest (issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.getPostUserInteractionRequestId,
      issues
    )
  }

  public static getPostReactionsCountRequest (issues: ZodIssue[]): PostsApiRequestValidatorError {
    return new PostsApiRequestValidatorError(
      this.getPostReactionsCountRequestId,
      issues
    )
  }
}
