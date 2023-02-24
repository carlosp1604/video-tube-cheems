import { ZodIssue } from 'zod'
import { ZodApiValidationError } from '../../Exceptions/Infrastructure/ZodApiValidationError'

export class ActorApiRequestValidatorError extends ZodApiValidationError {
  public static getActorRequestId = 'validator_exception_get_actor_request'
  public static getActorsRequestId = 'validator_exception_get_actors_request'
  
  public static getActorValidation(issues: ZodIssue[]): ActorApiRequestValidatorError {
    return new ActorApiRequestValidatorError(
      this.getActorRequestId,
      issues
    )
  }

  public static getActorsValidation(issues: ZodIssue[]): ActorApiRequestValidatorError {
    return new ActorApiRequestValidatorError(
      this.getActorsRequestId,
      issues
    )
  }
}