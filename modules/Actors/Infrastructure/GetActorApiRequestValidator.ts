import { z, ZodError } from 'zod'
import { ActorApiRequestValidatorError } from './ActorApiRequestValidatorError'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'

export class GetActorApiRequestValidator {
  private static getActorApiRequestSchema = z.string().uuid()

  public static validate (actorId: string): PostCommentApiRequestValidatorError | void {
    try {
      this.getActorApiRequestSchema.parse(actorId)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ActorApiRequestValidatorError.getActorValidation(exception.issues)
    }
  }
}
