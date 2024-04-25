import { z, ZodError } from 'zod'
import { ActorsApiRequestValidatorError } from './ActorsApiRequestValidatorError'
import { AddActorViewApiRequestDto } from '~/modules/Actors/Infrastructure/Api/AddActorViewApiRequestDto'

export class AddActorViewRequestValidator {
  private static addActorViewApiRequestSchema = z.object({
    actorId: z.string().uuid(),
  })

  public static validate (request: AddActorViewApiRequestDto): ActorsApiRequestValidatorError | void {
    try {
      this.addActorViewApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ActorsApiRequestValidatorError.addActorViewValidation(exception.issues)
    }
  }
}
