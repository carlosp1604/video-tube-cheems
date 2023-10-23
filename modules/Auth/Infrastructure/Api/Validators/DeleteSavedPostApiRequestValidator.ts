import { z, ZodError } from 'zod'
import { AddSavedPostApiRequest } from '~/modules/Auth/Infrastructure/Api/Requests/AddSavedPostApiRequest'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'

export class AddSavedPostApiRequestValidator {
  private static addSavedPostApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
  })

  public static validate (request: AddSavedPostApiRequest): UserApiValidationException | void {
    try {
      this.addSavedPostApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.addSavedPostRequest(exception.issues)
    }
  }
}
