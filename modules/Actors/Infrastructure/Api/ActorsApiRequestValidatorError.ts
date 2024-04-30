import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class ActorsApiRequestValidatorError extends ZodApiValidationException {
  public static getActorsRequestId = 'validator_exception_get_actors_request'
  public static addActorViewRequestId = 'validator_exception_add_actor_view_request'

  public static getActorsValidation (issues: ZodIssue[]): ActorsApiRequestValidatorError {
    return new ActorsApiRequestValidatorError(
      this.getActorsRequestId,
      issues
    )
  }

  public static addActorViewValidation (issues: ZodIssue[]): ActorsApiRequestValidatorError {
    return new ActorsApiRequestValidatorError(
      this.addActorViewRequestId,
      issues
    )
  }
}
