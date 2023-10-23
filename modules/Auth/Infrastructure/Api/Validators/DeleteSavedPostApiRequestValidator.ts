import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'

export class DeleteSavedPostApiRequestValidator {
  private static deleteSavedPostApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
  })

  public static validate (request: DeleteSavedPostApiRequestValidator): UserApiValidationException | void {
    try {
      this.deleteSavedPostApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.deleteSavedPostRequest(exception.issues)
    }
  }
}
