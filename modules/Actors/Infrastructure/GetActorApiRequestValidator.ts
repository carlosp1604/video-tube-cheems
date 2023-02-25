import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from '../../Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { ActorApiRequestValidatorError } from './ActorApiRequestValidatorError'

export class GetActorApiRequestValidator {
  private static getActorApiRequestSchema = z.string().uuid()

  public static validate(actorId: string): PostCommentApiRequestValidatorError | void {
    try {
      this.getActorApiRequestSchema.parse(actorId)
    }
    catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ActorApiRequestValidatorError.getActorValidation(exception.issues)
    }

    return
  }
}