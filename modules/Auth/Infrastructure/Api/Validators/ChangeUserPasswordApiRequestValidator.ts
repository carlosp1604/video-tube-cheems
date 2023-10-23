import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'
import {
  ChangeUserPasswordApiRequestInterface
} from '~/modules/Auth/Infrastructure/Dtos/ChangeUserPasswordApiRequestInterface'

export class ChangeUserPasswordApiRequestValidator {
  private static changeUserPasswordApiRequestSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(1),
    token: z.string().min(1),
  })

  public static validate (request: ChangeUserPasswordApiRequestInterface): UserApiValidationException | void {
    try {
      this.changeUserPasswordApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.changeUserPasswordRequest(exception.issues)
    }
  }
}
