import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import { ValidateTokenApiRequestInterface } from '~/modules/Auth/Infrastructure/Dtos/ValidateTokenApiRequestInterface'

export class ValidateTokenApiRequestValidator {
  private static validateTokenApiRequestSchema = z.object({
    email: z.string().email().min(1),
    token: z.string().min(1),
  })

  public static validate (request: ValidateTokenApiRequestInterface): UserApiValidationException | void {
    try {
      this.validateTokenApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.validateTokenRequest(exception.issues)
    }
  }
}
