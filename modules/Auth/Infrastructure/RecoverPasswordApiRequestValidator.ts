import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'


import { RecoverPasswordApiRequestInterface } from '~/modules/Auth/Infrastructure/RecoverPasswordApiRequestInterface'

export class RecoverPasswordApiRequestValidator {
  private static recoverPasswordApiRequestSchema = z.object({
    email: z.string().email().min(1),
    sendNewToken: z.boolean(),
  })

  public static validate (request: RecoverPasswordApiRequestInterface): UserApiValidationException | void {
    try {
      this.recoverPasswordApiRequestSchema.parse(request)
    }
 catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.recoverPasswordRequest(exception.issues)
    }
  }
}
