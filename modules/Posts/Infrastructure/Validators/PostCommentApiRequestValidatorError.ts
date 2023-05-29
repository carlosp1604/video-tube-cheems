import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '../../../Exceptions/Infrastructure/ZodApiValidationException'

export class PostCommentApiRequestValidatorError extends ZodApiValidationException {
  public static getCommentsRequestId = 'validator_exception_get_comments_request'
  public static getChildCommentsRequestId = 'validator_exception_get_child_comments_request'
  public static createCommentRequestId = 'validator_exception_create_comment_request'
  public static createChildCommentRequestId = 'validator_exception_create_chidl_comment_request'
  public static updateCommentRequestId = 'validator_exception_update_comment_request'
  
  public static createPostCommentValidation(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.createCommentRequestId,
      issues
    )
  }

  public static createPostChildCommentValidation(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.createChildCommentRequestId,
      issues
    )
  }

  public static updatePostCommentValidation(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.updateCommentRequestId,
      issues
    )
  }

  public static getPostCommentsValidator(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.getCommentsRequestId,
      issues
    )
  }

  public static getPostChildCommentsValidator(issues: ZodIssue[]): PostCommentApiRequestValidatorError {
    return new PostCommentApiRequestValidatorError(
      this.getChildCommentsRequestId,
      issues
    )
  }
}