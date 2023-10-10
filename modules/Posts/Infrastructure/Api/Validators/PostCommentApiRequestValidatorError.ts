import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class PostCommentApiRequestValidatorError extends ZodApiValidationException {
  public static getCommentsRequestId = 'validator_exception_get_comments_request'
  public static getChildCommentsRequestId = 'validator_exception_get_child_comments_request'
  public static createCommentRequestId = 'validator_exception_create_comment_request'
  public static createChildCommentRequestId = 'validator_exception_create_child_comment_request'
  public static updateCommentRequestId = 'validator_exception_update_comment_request'
  public static createPostCommentReactionRequestId = 'validator_exception_create_post_comment_reaction_request'
  public static deletePostCommentReactionRequestId = 'validator_exception_delete_post_comment_reaction_request'

  public static createPostCommentValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.createCommentRequestId,
      issues
    )
  }

  public static createPostChildCommentValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.createChildCommentRequestId,
      issues
    )
  }

  public static updatePostCommentValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.updateCommentRequestId,
      issues
    )
  }

  public static getPostCommentsValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.getCommentsRequestId,
      issues
    )
  }

  public static createPostCommentReactionValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.createPostCommentReactionRequestId,
      issues
    )
  }

  public static deletePostCommentReactionValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.deletePostCommentReactionRequestId,
      issues
    )
  }

  public static getPostChildCommentsValidation (issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.getChildCommentsRequestId,
      issues
    )
  }
}
