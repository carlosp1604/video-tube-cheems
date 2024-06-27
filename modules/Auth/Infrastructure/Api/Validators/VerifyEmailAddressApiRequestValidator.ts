import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'
import {
  VerifyEmailAddressApiRequestInterface
} from '~/modules/Auth/Infrastructure/Dtos/VerifyEmailAddressApiRequestInterface'

export class VerifyEmailAddressApiRequestValidator {
  private static verifyEmailAddressApiRequestSchema = z.object({
    type: z.string().min(1),
    email: z.string().email().min(1),
    sendNewToken: z.boolean(),
    locale: z.string().min(1),
  })

  public static validate (request: VerifyEmailAddressApiRequestInterface): UserApiValidationException | void {
    try {
      this.verifyEmailAddressApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      console.error(exception)
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.verifyEmailAddressRequest(exception.issues)
    }
  }
}
